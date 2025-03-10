import { selectAppLibraryQueuePositionMapState } from "@/redux/modules";
import { AppInformation } from "@/types";
import { useAppSelector } from "@/redux/store";
import { getAppStatusWithQueue } from "@/utils/app-info";

export const useAppStatus = (
  appInfo: AppInformation,
  ownedAppId: string | undefined
) => {
  const queuePositionMapState = useAppSelector(
    selectAppLibraryQueuePositionMapState
  );
  return getAppStatusWithQueue(appInfo, ownedAppId, queuePositionMapState);
};
