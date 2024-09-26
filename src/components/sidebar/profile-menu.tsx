import React, { useEffect, useState } from "react";
import { usePlayserve } from "@/hooks/use-playserve";
import { MessageType, getMessage } from "@/types/playserve/message";

import { t } from "@lingui/macro";
import {
  Avatar,
  Dropdown,
  DotsVertical,
  GamepadLine,
  ProgressSpinner,
  styles
} from "@playtron/styleguide";

export const ProfileMenu: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { sendMessage } = usePlayserve();

  useEffect(() => {
    const profileMessage = getMessage(MessageType.UserProfileGet, {});
    sendMessage(profileMessage)().then((response) => {
      if (response.status === 200) {
        setUsername(response?.body.auth.userName);
        setEmail(response?.body.auth.email);
      }
    });
  }, []);

  return (
    <div className="flex gap-x-4 items-center">
      <div className="flex-grow max-w-48 m-4">
        {username ? (
          <Avatar name={username} description={email} />
        ) : (
          <ProgressSpinner size={32} />
        )}
      </div>
      <div className="flex-shrink m-2">
        <Dropdown
          data={[
            {
              id: 2,
              label: t`Change device`,
              icon: <GamepadLine fill={styles.variablesDark.fill.white} />,
              route: "/auth/connect"
            }
          ]}
          triggerElem={
            <DotsVertical
              fill={styles.variablesDark.fill.white}
              className="cursor-pointer"
            />
          }
        />
      </div>
    </div>
  );
};
