import React, { FormEvent } from "react";
import easyFetch from "../../util/easy-fetch";
import Modal from "../../util/modal.component";
import { UserAccessLevel } from "../../util/user.context";
import { User, UserPermissions } from "./user-permissions.component";
import css from "./edit-user.css";
import { useCss } from "kremling";
import { capitalize } from "../../reports/shared/report.helpers";
import { GrowlType, showGrowl } from "../../growls/growls.component";
import { method } from "lodash-es";

export default function EditUser(props: EditUserProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [accessLevel, setAccessLevel] = React.useState<UserAccessLevel>(
    props.user.accessLevel
  );
  const [permissions, setPermissions] = React.useState<UserPermissions>(
    props.user.permissions
  );
  const [deleting, setDeleting] = React.useState<boolean>(false);

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
