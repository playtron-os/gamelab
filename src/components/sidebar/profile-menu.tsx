import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  setUsername,
  setEmail,
  selectAuthState,
  AuthState,
  setAvatarUrl
} from "@/redux/modules/auth";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setDeviceIp } from "@/redux/modules";
import { usePlayserve } from "@/hooks/use-playserve";
import { MessageType, getMessage } from "@/types/playserve/message";

import { t } from "@lingui/macro";
import {
  Avatar,
  ProgressSpinner,
  LogoutBoxLine,
  ConfirmationPopUp,
  styles
} from "@playtron/styleguide";

export const ProfileMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { username, avatar } = useAppSelector(selectAuthState) as AuthState;
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
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
      <div className="flex-grow max-w-36 m-4">
        {username ? (
          <Avatar name={username} src={avatar} />
        ) : (
          <ProgressSpinner size={32} />
        )}
      </div>

      <div
        className="flex-shrink m-2 p-1 rounded-sm cursor-pointer hover:outline-2 hover:outline-white hover:outline-double"
        onClick={() => {
          setConfirmDisconnect(true);
        }}
      >
        <LogoutBoxLine fill={styles.variablesDark.fill.white} />
      </div>
      <ConfirmationPopUp
        isOpen={confirmDisconnect}
        onClose={() => setConfirmDisconnect(false)}
        title={t`Disconnect from device?`}
        onConfirm={() => {
          setConfirmDisconnect(false);
          dispatch(setDeviceIp(""));
          navigate("/auth/connect");
        }}
        className="z-[62]"
      />
    </div>
  );
};
