import React, { useEffect } from "react";
import {
  setUsername,
  setEmail,
  selectAuthState,
  AuthState
} from "@/redux/modules/auth";
import { useAppSelector, useAppDispatch } from "@/redux/store";
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
  const dispatch = useAppDispatch();
  const { username, email } = useAppSelector(selectAuthState) as AuthState;
  const { sendMessage } = usePlayserve();

  useEffect(() => {
    const profileMessage = getMessage(MessageType.UserProfileGet, {});
    sendMessage(profileMessage)().then((response) => {
      if (response.status === 200) {
        dispatch(setUsername(response?.body.auth.userName));
        dispatch(setEmail(response?.body.auth.email));
      }
    });
  }, []);

  return (
    <div className="flex gap-x-4 items-center">
      <div className="flex-grow max-w-40 m-4">
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
