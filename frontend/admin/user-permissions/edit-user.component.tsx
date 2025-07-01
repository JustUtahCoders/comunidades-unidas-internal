import React, { FormEvent } from "react";
import easyFetch from "../../util/easy-fetch";
import Modal from "../../util/modal.component";
import { UserAccessLevel } from "../../util/user.context";
import { User, UserPermissions } from "./user-permissions.component";
import css from "./edit-user.css";
import { useCss } from "kremling";
import { capitalize } from "../../reports/shared/report.helpers";
import { GrowlType, showGrowl } from "../../growls/growls.component";
import * as base64ArrayBuffer from "base64-arraybuffer";

export default function EditUser(props: EditUserProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [accessLevel, setAccessLevel] = React.useState<UserAccessLevel>(
    props.user.accessLevel
  );
  const [permissions, setPermissions] = React.useState<UserPermissions>(
    props.user.permissions
  );
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [isUpdatingHardwareKey, setIsUpdatingHardwareKey] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (isUpdatingHardwareKey) {
      const ac = new AbortController();
      easyFetch(
        `/api/users/${props.user.id}/hardware-security-key-attestation`,
        {
          signal: ac.signal,
        }
      ).then((attestationOptions) => {
        attestationOptions.user.id = base64ArrayBuffer.decode(
          attestationOptions.user.id
        );
        attestationOptions.challenge = base64ArrayBuffer.decode(
          attestationOptions.challenge
        );

        return navigator.credentials
          .create({ publicKey: attestationOptions })
          .then((credential) => {
            return easyFetch(
              `/api/users/${props.user.id}/hardware-security-key`,
              {
                method: "PATCH",
                body: {
                  credential: {
                    id: credential.id,
                    // @ts-expect-error
                    rawId: base64ArrayBuffer.encode(credential.rawId),
                    response: {
                      clientDataJSON: base64ArrayBuffer.encode(
                        // @ts-expect-error
                        credential.response.clientDataJSON
                      ),
                      attestationObject: base64ArrayBuffer.encode(
                        // @ts-expect-error
                        credential.response.attestationObject
                      ),
                    },
                    type: credential.type,
                  },
                },
              }
            );
          });
      });

      return () => {
        ac.abort();
      };
    }
  }, [isUpdatingHardwareKey]);

  React.useEffect(() => {
    if (isSaving) {
      const ac = new AbortController();
      easyFetch(`/api/users/${props.user.id}`, {
        signal: ac.signal,
        method: "PATCH",
        body: {
          accessLevel,
          permissions,
        },
      })
        .then(() => {
          showGrowl({ type: GrowlType.success, message: `User was updated` });
          props.close(true);
        })
        .finally(() => {
          setIsSaving(false);
        });

      return () => {
        ac.abort();
      };
    }
  }, [isSaving]);

  React.useEffect(() => {
    if (deleting) {
      const ac = new AbortController();

      easyFetch(`/api/users/${props.user.id}`, {
        method: "DELETE",
        signal: ac.signal,
      })
        .then(() => {
          showGrowl({
            type: GrowlType.success,
            message: "User was updated",
          });
          props.close(true);
        })
        .finally(() => {
          setDeleting(false);
        });

      return () => {
        ac.abort();
      };
    }
  });

  return (
    <Modal
      headerText="Edit User"
      primaryText="Save"
      primaryAction={handleSubmit}
      secondaryText="Cancel"
      secondaryAction={props.close}
      close={props.close}
      primarySubmit
      tertiaryAction={() => setDeleting(true)}
      tertiaryText="Delete"
    >
      <div {...useCss(css)}>
        <div>{props.user.fullName}</div>
        <div className="form-group">
          <label htmlFor="user-admin">Administrator:</label>
          <input
            type="checkbox"
            id="user-admin"
            name="user-admin"
            checked={accessLevel === UserAccessLevel.Administrator}
            onChange={(evt) =>
              setAccessLevel(
                evt.target.checked
                  ? UserAccessLevel.Administrator
                  : UserAccessLevel.Staff
              )
            }
          />
        </div>
        {Object.keys(props.user.permissions).map((permName) => (
          <div key={permName} className="form-group">
            <label htmlFor={`user-perm-${permName}`}>
              {capitalize(permName)}:
            </label>
            <input
              type="checkbox"
              id={`user-perm-${permName}`}
              name={`user-perm-${permName}`}
              checked={permissions[permName]}
              onChange={(evt) =>
                setPermissions({
                  ...permissions,
                  [permName]: evt.target.checked,
                })
              }
            />
          </div>
        ))}
        <div className="form-group">
          <button onClick={() => setIsUpdatingHardwareKey(true)}>
            Set Hardware Key
          </button>
        </div>
      </div>
    </Modal>
  );

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    setIsSaving(true);
  }
}

type EditUserProps = {
  user: User;
  close(refetch?: true): any;
};
