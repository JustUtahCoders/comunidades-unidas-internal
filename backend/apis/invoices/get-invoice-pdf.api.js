const {
  app,
  databaseError,
  pool,
  invalidRequest,
  notFound,
  insufficientPrivileges,
} = require("../../server");
const {
  checkValid,
  validId,
  nullableValidTags,
} = require("../utils/validation-utils");
const PDFDocument = require("pdfkit");
const { getFullInvoiceById } = require("./get-invoice.api");
const path = require("path");
const { getAllClientsById } = require("../clients/get-clients-by-id.api");
const { responseFullName } = require("../utils/transform-utils");
const dayjs = require("dayjs");
const { capitalize, sumBy } = require("lodash");
const { sanitizeTags, validTagsList } = require("../tags/tag.utils");

const pageWidth = 595;
const palatino = path.resolve(__dirname, "./fonts/Palatino.ttf");
const palatinoBold = path.resolve(__dirname, "./fonts/Palatino-Bold.otf");

app.get("/api/invoices/:invoiceId/pdfs", (req, res) => {
  const user = req.session.passport.user;

  const validationErrors = [
    ...checkValid(req.params, validId("invoiceId")),
    ...checkValid(req.query, nullableValidTags("tags", user.permissions)),
  ];

  if (validationErrors.length) {
    return invalidRequest(res, validationErrors);
  }

  const tags = sanitizeTags(req.query.tags);
  const redactedTags = validTagsList.filter((t) => !tags.includes(t));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  getFullInvoiceById(
    { id: req.params.invoiceId, redactedTags },
    (err, invoice) => {
      if (err) {
        return databaseError(req, res, err);
      } else if (invoice === 404) {
        return notFound(
          res,
          `No invoice found with id ${req.params.invoiceId}`
        );
      } else if (invoice.redacted) {
        return insufficientPrivileges(res, `Invoice is redacted`);
      } else {
        const clientErrBack = (err, client) => {
          if (err) {
            return databaseError(err);
          }

          if (!client) {
            client = [];
          }

          const doc = new PDFDocument();
          res.status(200);
          res.set("Content-Type", "application/pdf");
          const isDownload = req.query.download === "true";
          res.set(
            "Content-Disposition",
            `${isDownload ? "attachment" : "inline"}; filename="Invoice_${
              invoice.invoiceNumber
            }.pdf"`
          );

          doc.pipe(res);

          doc.font(palatinoBold);
          doc.fontSize(18);

          // header text
          const headerText = `Invoice #${invoice.invoiceNumber}`;
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
          const payerLeft = 345;
          doc.font(palatino);
          doc.text("Bill To:", payerLeft, topLine);

          const billToRows = client.length + (invoice.billTo ? 1 : 0);

          client.forEach((item, index) => {
            const billTo = responseFullName(item.firstName, item.lastName);
            doc.text(
              billTo,
              pageWidth - pageMargin - doc.widthOfString(billTo),
              topLine + lineHeight * index,
              {
                lineBreak: false,
              }
            );
          });

          if (invoice.billTo) {
            doc.text(
              invoice.billTo,
              pageWidth - pageMargin - doc.widthOfString(invoice.billTo),
              topLine + lineHeight * client.length,
              {
                lineBreak: false,
              }
            );
          }

          if (client.length > 0) {
            doc.text(
              "Client ID:",
              payerLeft,
              topLine + lineHeight * client.length
            );
          }
          doc.text(
            "Invoice Number:",
            payerLeft,
            topLine + lineHeight * (billToRows + 1)
          );
          doc.text(
            "Invoice Date:",
            payerLeft,
            topLine + lineHeight * (billToRows + 2)
          );
          doc.text(
            "Invoice Amount:",
            payerLeft,
            topLine + lineHeight * (billToRows + 3)
          );
          doc.text(
            "Invoice Status:",
            payerLeft,
            topLine + lineHeight * (billToRows + 4)
          );

          const ids = client.map((item) => item.id).join(", ");
          doc.text(
            ids,
            pageWidth - pageMargin - doc.widthOfString(ids),
            topLine + lineHeight * client.length,
            {
              lineBreak: false,
            }
          );

          doc.text(
            invoice.invoiceNumber,
            pageWidth - pageMargin - doc.widthOfString(invoice.invoiceNumber),
            topLine + lineHeight * (billToRows + 1),
            {
              lineBreak: false,
            }
          );

          const invoiceDate = dayjs(invoice.invoiceDate).format("MMM DD, YYYY");
          doc.text(
            invoiceDate,
            pageWidth - pageMargin - doc.widthOfString(invoiceDate),
            topLine + lineHeight * (billToRows + 2),
            {
              lineBreak: false,
            }
          );

          const amount = `$${
            invoice.totalCharged ? invoice.totalCharged.toFixed(2) : "0.00"
          }`;
          doc.text(
            amount,
            pageWidth - pageMargin - doc.widthOfString(amount),
            topLine + lineHeight * (billToRows + 3),
            {
              lineBreak: false,
            }
          );

          const status = capitalize(invoice.status);
          doc.text(
            status,
            pageWidth - pageMargin - doc.widthOfString(status),
            topLine + lineHeight * (billToRows + 4),
            {
              lineBreak: false,
            }
          );

          // Table

          // Header
          const tableHeaderTop = 330;
          const col1Left = pageMargin;
          const col2Left = 200;
          const col3Left = 400;
          const col4Left = 440;
          const col5Left = 490;
          doc.font(palatinoBold);
          doc.text(" Service", col1Left, tableHeaderTop);
          doc.text("Description", col2Left, tableHeaderTop);
          doc.text("Qty", col3Left, tableHeaderTop);
          doc.text("Rate", col4Left, tableHeaderTop);
          doc.text("Amount", col5Left, tableHeaderTop);

          const tableHeaderLineTop = tableHeaderTop + rawLineHeight + 6;

          doc
            .moveTo(pageMargin, tableHeaderLineTop)
            .lineTo(pageWidth - pageMargin, tableHeaderLineTop)
            .strokeColor("#cfcfcf")
            .stroke();

          // Invoice rows
          let tableFooterLineTop;
          doc.font(palatino);
          const invoiceTop = tableHeaderLineTop + 15;
          if (invoice.lineItems.length === 0) {
            const top = invoiceTop + 4;
            doc.text(" (No Line Items)", col1Left, top);
            doc.text(` $0.00`, col4Left, top);
            tableFooterLineTop = invoiceTop + lineHeight;
          } else {
            let top = invoiceTop;
            invoice.lineItems.forEach((lineItem, i) => {
              const nameWidth = col2Left - col1Left - 10;
              const descriptionWidth = col3Left - col2Left - 10;
              doc.text(lineItem.name, col1Left, top, {
                width: nameWidth,
              });
              doc.text(lineItem.description, col2Left, top, {
                width: descriptionWidth,
              });
              doc.text(` ${lineItem.quantity.toLocaleString()}`, col3Left, top);
              doc.text(
                "$" + lineItem.rate.toFixed(2).toLocaleString(),
                col4Left,
                top
              );
              doc.text(
                ` $${(lineItem.quantity * lineItem.rate)
                  .toFixed(2)
                  .toLocaleString()}`,
                col5Left,
                top
              );
              const height = Math.max(
                doc.heightOfString(lineItem.name, { width: nameWidth }),
                doc.heightOfString(lineItem.description, {
                  width: descriptionWidth,
                })
              );
              top += height + 15;
            });
            tableFooterLineTop = top;
          }

          doc
            .moveTo(pageMargin, tableFooterLineTop)
            .lineTo(pageWidth - pageMargin, tableFooterLineTop)
            .strokeColor("#cfcfcf")
            .stroke();

          // Other rows
          const otherLeft = 405;
          const otherTop = 14 + tableFooterLineTop;
          const otherWidth = doc.widthOfString("Total Owed:") + 1;
          doc.text("Subtotal:", otherLeft, otherTop, {
            width: otherWidth,
            align: "right",
          });
          doc.text("Discount:", otherLeft, otherTop + lineHeight, {
            width: otherWidth,
            align: "right",
          });
          doc.text("Total Owed:", otherLeft, otherTop + lineHeight * 2, {
            width: otherWidth,
            align: "right",
          });
          doc.text("Total Paid:", otherLeft, otherTop + lineHeight * 3, {
            width: otherWidth,
            align: "right",
          });
          doc.text("Balance:", otherLeft, otherTop + lineHeight * 4, {
            width: otherWidth,
            align: "right",
          });

          const subtotal = sumBy(
            invoice.lineItems,
            (li) => li.quantity * li.rate
          );
          const discount = subtotal - invoice.totalCharged;
          const totalPaid = sumBy(invoice.payments, "amountTowardsInvoice");
          const balance = invoice.totalCharged - totalPaid;

          doc.text(
            ` $${subtotal.toFixed(2).toLocaleString()}`,
            col5Left,
            otherTop
          );
          doc.text(
            ` ($${discount.toFixed(2).toLocaleString()})`,
            col5Left,
            otherTop + lineHeight
          );
          doc.text(
            ` $${(invoice.totalCharged || 0).toFixed(2).toLocaleString()}`,
            col5Left,
            otherTop + lineHeight * 2
          );
          doc.text(
            ` $${totalPaid.toFixed(2).toLocaleString()}`,
            col5Left,
            otherTop + lineHeight * 3
          );
          doc.text(
            ` ${balance < 0 ? "(" : ""}$${Math.abs(balance)
              .toFixed(2)
              .toLocaleString()}${balance < 0 ? ")" : ""}`,
            col5Left,
            otherTop + lineHeight * 4
          );

          // Client Note
          if (invoice.clientNote) {
            doc.text("Client Note", pageMargin, otherTop);
            doc.text(
              invoice.clientNote || "",
              pageMargin,
              otherTop + rawLineHeight
            );
          }

          doc.end();
        };

        if (invoice.clients.length > 0) {
          getAllClientsById(invoice.clients, clientErrBack);
        } else {
          clientErrBack(null, null);
        }
      }
    }
  );
});
