import React, { useEffect } from "react";
import {
  setUsername,
  setEmail,
  selectAuthState,
  AuthState,
  setAvatarUrl
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
  const { username, email, avatar } = useAppSelector(
    selectAuthState
  ) as AuthState;
  const { sendMessage } = usePlayserve({
    onMessage: (message) => {
      if (
        message.message_type == MessageType.AvatarUpdate &&
        message.status === 200
      ) {
        const selectedAvatar = message.body.selectedProvider;
        if (selectedAvatar) {
          dispatch(setAvatarUrl(message.body[selectedAvatar]?.url));
        }
      }
    }
  });

  useEffect(() => {
    const profileMessage = getMessage(MessageType.UserProfileGet, {});
    sendMessage(profileMessage)().then((response) => {
      if (response.status === 200) {
        dispatch(setUsername(response?.body.auth.userName));
        dispatch(setEmail(response?.body.auth.email));
        const selectedAvatar = response?.body.profile.avatar.selectedProvider;
        if (selectedAvatar) {
          dispatch(
            setAvatarUrl(response.body.profile.avatar[selectedAvatar]?.url)
          );
        }
      }
    });
  }, []);

  return (
    <div className="flex gap-x-4 items-center">
      <div className="flex-grow max-w-40 m-4">
        {username ? (
          <Avatar name={username} description={email} src={avatar} />
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
