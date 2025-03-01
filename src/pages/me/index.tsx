import { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import {
  getUserInfoApi,
  bindLoverApi,
  rejectLoverRequestApi,
  acceptLoverRequestApi,
  unbindLoverApi,
  UserGender,
  type UserInfo,
  LoverRequestStatus,
} from "@/api/user";
import SvgIcon from "@/components/SvgIcon";
import { Setting, Power } from "@nutui/icons-react";
import { Popup, Dialog, Input, Toast } from "@nutui/nutui-react";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { KeepAliveContext } from "@/contexts/keepAlive";
import { useAppDispatch } from "@/store/hooks";

const Me: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { clearCache } = useContext(KeepAliveContext);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [loverUid, setLoverUid] = useState("");

  const getUserInfo = async () => {
    const res = await getUserInfoApi();
    setUserInfo(res);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleBindLover = async () => {
    await bindLoverApi(loverUid);
    Toast.show({
      content: "已发送绑定请求",
    });
    getUserInfo(); // 刷新用户信息
    setIsModalOpen(false);
    setLoverUid("");
  };

  const handleRejectLover = async (requestId: number) => {
    await rejectLoverRequestApi(requestId);
    Toast.show({
      content: "已拒绝请求",
    });
    getUserInfo(); // 刷新用户信息
  };

  const handleAcceptLover = async (requestId: number) => {
    await acceptLoverRequestApi(requestId);
    Toast.show({
      content: "已接受请求",
    });
    getUserInfo(); // 刷新用户信息
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setLoverUid("");
  };

  const handleLogout = () => {
    Dialog.alert({
      className: "dialog-func",
      title: "提示",
      content: "确定要退出登录吗？",
      footerDirection: "vertical",
      onConfirm: () => {
        // 先清除 KeepAlive 缓存
        clearCache();
        // 清除 Redux 状态
        dispatch(logout());
        // 跳转到登录页
        navigate("/login");
      },
    });
  };

  const handleUnbindLover = async () => {
    Dialog.alert({
      title: "提示",
      content: "确定要解除与恋人的绑定关系吗？",
      footerDirection: "vertical",
      onConfirm: async () => {
        await unbindLoverApi();
        Toast.show({
          content: "已解除绑定关系",
        });
        getUserInfo(); // 刷新用户信息
      },
    });
  };

  const renderReceivedRequests = () => {
    // 显示收到的请求
    const pendingRequests = userInfo?.receivedRequests.filter(
      (request) => request.status === LoverRequestStatus.待处理,
    );
    if (pendingRequests) {
      return pendingRequests.map((pendingRequest) => {
        const { sender } = pendingRequest;
        return (
          <div className={styles.receivedRequest} key={pendingRequest.id}>
            <div className={styles.requestInfo}>
              <img src={sender.avatar} alt="requester avatar" className={styles.requesterAvatar} />
              <div className={styles.requesterDetail}>
                <div className={styles.requesterName}>
                  {sender.username}
                  <span className={styles.requesterGender}>
                    {sender.gender === UserGender.男 ? (
                      <SvgIcon name="boy" width={12} height={12} />
                    ) : (
                      <SvgIcon name="girl" width={12} height={12} />
                    )}
                  </span>
                </div>
                <div className={styles.requestText}>请求与你绑定为恋人</div>
              </div>
            </div>
            <div className={styles.requestActions}>
              <button
                className={styles.rejectButton}
                onClick={() => handleRejectLover(pendingRequest.id)}
              >
                拒绝
              </button>
              <button
                className={styles.acceptButton}
                onClick={() => handleAcceptLover(pendingRequest.id)}
              >
                接受
              </button>
            </div>
          </div>
        );
      });
    }
    return <div className={styles.requestPending}>没有收到请求</div>;
  };

  const renderSentRequests = () => {
    // 显示发出的请求
    const pendingSentRequests = userInfo?.sentRequests.filter(
      (request) => request.status === LoverRequestStatus.待处理,
    );

    if (pendingSentRequests) {
      return pendingSentRequests.map((pendingSentRequest) => {
        const { receiver } = pendingSentRequest;
        return (
          <div className={styles.requestPending} key={pendingSentRequest.id}>
            <div className={styles.requestInfo}>
              <img src={receiver.avatar} alt="receiver avatar" className={styles.receiverAvatar} />
              <div className={styles.receiverDetail}>
                <div className={styles.receiverName}>
                  {receiver.username}
                  <span className={styles.receiverGender}>
                    {receiver.gender === UserGender.男 ? (
                      <SvgIcon name="boy" width={12} height={12} />
                    ) : (
                      <SvgIcon name="girl" width={12} height={12} />
                    )}
                  </span>
                </div>
                <div className={styles.requestText}>等待对方接受绑定请求...</div>
              </div>
            </div>
          </div>
        );
      });
    }
    return <div className={styles.requestPending}>没有发出请求</div>;
  };

  const renderLoverContent = () => {
    if (!userInfo) return null;

    const content = [];

    if (userInfo.lover) {
      content.push(
        <div key="lover" className={styles.loverCard}>
          <h3>我的恋人</h3>
          <div className={styles.loverBasic}>
            <img src={userInfo.lover.avatar} alt="lover avatar" className={styles.loverAvatar} />
            <div className={styles.loverDetail}>
              <div className={styles.loverName}>{userInfo.lover.username}</div>
              <div className={styles.loverUid}>
                用户号: {userInfo.lover.uid}
                <span className={styles.loverGender}>
                  {userInfo.lover.gender === UserGender.男 ? (
                    <SvgIcon name="boy" width={12} height={12} />
                  ) : (
                    <SvgIcon name="girl" width={12} height={12} />
                  )}
                </span>
              </div>
            </div>
            <button className={styles.unbindButton} onClick={handleUnbindLover}>
              解除绑定
            </button>
          </div>
        </div>,
      );
    }

    // 没有恋人
    if (!userInfo.lover) {
      content.push(
        <div className={styles.noLover} key="noLover">
          <p>还没有绑定恋人</p>
          <button className={styles.bindButton} onClick={() => setIsModalOpen(true)}>
            绑定恋人
          </button>
        </div>,
      );
    }

    return content;
  };

  return (
    <div className={styles.meContainer}>
      <div className={styles.settingWrap} onClick={() => setShowSetting(true)}>
        <Setting />
      </div>
      <Popup
        visible={showSetting}
        style={{ width: "45%", height: "100%" }}
        position="right"
        onClose={() => {
          setShowSetting(false);
        }}
      >
        <div className={styles.settingContent}>
          <div className={styles.settingItem} onClick={handleLogout}>
            <div className={styles.settingIcon}>
              <Power />
            </div>
            <div className={styles.settingText}>退出登录</div>
          </div>
        </div>
      </Popup>
      <div className={styles.basicInfo}>
        <div className={styles.avatar}>
          <img src={userInfo?.avatar} alt="avatar" />
        </div>
        <div className={styles.userBasic}>
          <div className={styles.username}>{userInfo?.username}</div>
          <div className={styles.userContent}>
            <div className={styles.uid}>用户号: {userInfo?.uid}</div>
            <div className={styles.gender}>
              {userInfo?.gender === UserGender.男 ? (
                <SvgIcon name="boy" width={12} height={12} />
              ) : (
                <SvgIcon name="girl" width={12} height={12} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.loverInfo}>{renderLoverContent()}</div>

      <div className={styles.requestInfo}>
        {renderReceivedRequests()}
        {renderSentRequests()}
      </div>

      <Dialog
        title="绑定恋人"
        visible={isModalOpen}
        footerDirection="vertical"
        onConfirm={handleBindLover}
        onCancel={handleCancel}
      >
        <div className={styles.modalContent}>
          <Input
            value={loverUid}
            onChange={(val) => setLoverUid(val)}
            placeholder="请输入对方的用户号："
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Me;
