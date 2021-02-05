const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
} = require("../../server");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../utils/validation-utils");
const PDFDocument = require("pdfkit");
const { getFullPaymentById } = require("./get-payment.api");
const path = require("path");
const { getClientById } = require("../clients/get-client.api");
const { responseFullName } = require("../utils/transform-utils");
const dayjs = require("dayjs");
const { capitalize, sumBy } = require("lodash");

const pageWidth = 595;
const palatino = path.resolve(__dirname, "./fonts/Palatino.ttf");
const palatinoBold = path.resolve(__dirname, "./fonts/Palatino-Bold.otf");
const {
  sanitizeTags,
  validTagsList,
  insertTagsQuery,
} = require("../tags/tag.utils");

app.get("/api/payments/:paymentId/receipts", (req, res) => {
  const user = req.session.passport.user;
  const validationErrors = [
    ...checkValid(req.params, validId("paymentId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const paymentId = req.params.paymentId;
  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  getFullPaymentById({ paymentId, redactedTags }, (err, payment) => {
    if (err) {
      return databaseError(req, res, err);
    } else if (payment === 404) {
      return notFound(res, `No payment found with id ${req.params.paymentId}`);
    } else if (payment.redacted) {
      return invalidRequest(res, `Payment is redacted`);
    } else {
      const clientErrBack = (err, client) => {
        if (err) {
          return databaseError(err);
        }

        const paymentNumber = String(payment.id).padStart(4, "0");
        const doc = new PDFDocument();
        res.status(200);
        res.set("Content-Type", "application/pdf");
        const isDownload = req.query.download === "true";
        res.set(
          "Content-Disposition",
          `${
            isDownload ? "attachment" : "inline"
          }; filename="Payment_${paymentNumber}.pdf"`
        );

        doc.pipe(res);

        doc.font(palatinoBold);
        doc.fontSize(18);

        // header text
        const headerText = "Payment Receipt";
        const headerWidth = doc.widthOfString(headerText);
        const headerHeight = doc.heightOfString(headerText);
        const headerLeft = pageWidth / 2 - headerWidth / 2;
        const headerTop = 40;
        const rectangleBuffer = 10;
        const rectangleTop = headerTop - rectangleBuffer;
        const rectangleBottom = headerTop + headerHeight + rectangleBuffer;
        const rectangleLeft = headerLeft - rectangleBuffer;
        const rectangleRight = headerLeft + headerWidth + rectangleBuffer;

        const pageMargin = rectangleTop;

        doc
          .polygon(
            [rectangleLeft, rectangleTop],
            [rectangleRight, rectangleTop],
            [rectangleRight, rectangleBottom],
            [rectangleLeft, rectangleBottom]
          )
          .fillOpacity(0.1)
          .fillAndStroke("black", "#00000");
        doc.fillOpacity(1).text(headerText, headerLeft, headerTop);

        // Logo
        doc.image(
          path.resolve(__dirname, "../../../images/cu-logo.png"),
          pageMargin,
          pageMargin,
          { width: 50 }
        );

        doc.font(palatinoBold);
        const boldLineHeight = doc.heightOfString("foo") + 5;

        doc.font(palatino);
        const rawLineHeight = doc.heightOfString("foo");
        const lineHeight = rawLineHeight + 5;

        const topLine = 120;

        // CU Info
        doc.font(palatinoBold);
        doc.fontSize(12);
        doc.text("Comunidades Unidas", pageMargin, topLine);
        doc.font(palatino);
        doc.text(
          "1750 W Research Way Suite 102",
          pageMargin,
          topLine + boldLineHeight
        );
        doc.text(
          "West Valley City, Utah 84119",
          pageMargin,
          topLine + boldLineHeight + rawLineHeight
        );
        doc.text(
          "Hours: Mon-Thurs 8:00AM to 6:00PM.",
          pageMargin,
          topLine + boldLineHeight + rawLineHeight * 2
        );
        doc.text(
          "Phone: 1 (801) 487-4143",
          pageMargin,
          topLine + boldLineHeight + rawLineHeight * 3
        );

        // Payment info
        const payerLeft = 340;
        doc.font(palatino);
        doc.text("Paid By:", payerLeft, topLine);
        if (client) {
          doc.text("Client ID:", payerLeft, topLine + lineHeight);
        }
        doc.text("Payment Date:", payerLeft, topLine + lineHeight * 2);
        doc.text("Payment #:", payerLeft, topLine + lineHeight * 3);
        doc.text("Payment Amount:", payerLeft, topLine + lineHeight * 4);
        doc.text("Payment Method:", payerLeft, topLine + lineHeight * 5);

        const paymentDate = dayjs(payment.paymentDate).format("MMM DD, YYYY");
        doc.text(
          paymentDate,
          pageWidth - pageMargin - doc.widthOfString(paymentDate),
          topLine + lineHeight * 2,
          {
            align: "right",
            lineBreak: false,
          }
        );

        doc.text(
          paymentNumber,
          pageWidth - pageMargin - doc.widthOfString(paymentNumber),
          topLine + lineHeight * 3,
          {
            align: "right",
            lineBreak: false,
          }
        );

        const paymentAmount = `$${payment.paymentAmount.toFixed(2)}`;
        doc.text(
          paymentAmount,
          pageWidth - pageMargin - doc.widthOfString(paymentAmount),
          topLine + lineHeight * 4,
          {
            align: "right",
            lineBreak: false,
          }
        );

        const paymentMethod = humanReadablePaymentMethod(payment.paymentType);
        doc.text(
          paymentMethod,
          pageWidth - pageMargin - doc.widthOfString(paymentMethod),
          topLine + lineHeight * 5,
          {
            align: "right",
            lineBreak: false,
          }
        );

        // Payer information
        if (client) {
          const clientFullName = responseFullName(
            client.firstName,
            client.lastName
          );
          doc.text(
            clientFullName,
            pageWidth - pageMargin - doc.widthOfString(clientFullName),
            topLine,
            {
              align: "right",
              lineBreak: false,
            }
          );

          doc.text(
            String(client.id),
            pageWidth - pageMargin - doc.widthOfString(String(client.id)),
            topLine + lineHeight,
            {
              align: "right",
              lineBreak: false,
            }
          );
        } else {
          const payerName = payment.payerName || "";
          doc.text(
            payerName,
            pageWidth - pageMargin - doc.widthOfString(payerName),
            topLine,
            {
              align: "right",
              lineBreak: false,
            }
          );
        }

        // Table

        // Header
        const tableHeaderTop = 300;
        const col1Left = pageMargin;
        const col2Left = 150;
        const col3Left = 300;
        const col4Left = 450;
        doc.font(palatinoBold);
        doc.text(" Invoice #", col1Left, tableHeaderTop);
        doc.text("Invoice Amount", col2Left, tableHeaderTop);
        doc.text("Invoice Status", col3Left, tableHeaderTop);
        doc.text("Amount Paid", col4Left, tableHeaderTop);

        const tableHeaderLineTop = tableHeaderTop + rawLineHeight + 6;
        doc
          .moveTo(pageMargin, tableHeaderLineTop)
          .lineTo(pageWidth - pageMargin, tableHeaderLineTop)
          .strokeColor("#cfcfcf")
          .stroke();

        // Invoice rows
        let tableFooterLineTop;
        doc.font(palatino);
        const invoiceTop = tableHeaderLineTop + 9;
        if (payment.invoices.length === 0) {
          const top = invoiceTop + 4;
          doc.text(" (No Invoices Paid)", col1Left, top);
          doc.text(` $0.00`, col4Left, top);
          tableFooterLineTop = invoiceTop + lineHeight;
        } else {
          payment.invoices.forEach((invoice, i) => {
            const top = invoiceTop + lineHeight * i;
            doc.text(`  ${invoice.invoiceNumber}`, col1Left, top);
            doc.text(` $${invoice.totalCharged.toFixed(2)}`, col2Left, top);
            doc.text(` ${capitalize(invoice.status)}`, col3Left, top);
            doc.text(` $${invoice.amount.toFixed(2)}`, col4Left, top);
          });
          tableFooterLineTop =
            invoiceTop + lineHeight * payment.invoices.length - 6;
        }

        doc
          .moveTo(pageMargin, tableFooterLineTop)
          .lineTo(pageWidth - pageMargin, tableFooterLineTop)
          .strokeColor("#cfcfcf")
          .stroke();

        // Other rows
        const otherLeft = 380;
        const otherTop = 14 + tableFooterLineTop;
        const donationWidth = doc.widthOfString("Donation:");
        doc.text("Donation:", otherLeft, otherTop, {
          width: donationWidth,
          align: "right",
        });
        doc.text("Other:", otherLeft, otherTop + lineHeight, {
          width: donationWidth,
          align: "right",
        });
        doc.text("Total:", otherLeft, otherTop + lineHeight * 2, {
          width: donationWidth,
          align: "right",
        });

        const invoiceTotal = sumBy(payment.invoices, "amount");

        const donation = payment.donationAmount || 0;
        doc.text(` $${donation.toFixed(2)}`, col4Left, otherTop);
        doc.text(
          ` $${(payment.paymentAmount - invoiceTotal - donation).toFixed(2)}`,
          col4Left,
          otherTop + lineHeight
        );
        doc.text(
          ` $${payment.paymentAmount.toFixed(2)}`,
          col4Left,
          otherTop + lineHeight * 2
        );

        doc.end();
      };
      if (payment.payerClientIds.length > 0) {
        getClientById(payment.payerClientIds[0], clientErrBack);
      } else {
        clientErrBack(null, null);
      }
    }
  });
});

function humanReadablePaymentMethod(paymentMethod) {
  switch (paymentMethod) {
    case "credit":
      return "Credit Card";
    case "debit":
      return "Debit Card";
    default:
      return capitalize(paymentMethod);
  }
}
