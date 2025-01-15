import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getUserInfoApi, type UserInfo } from "@/api/user";

const Me: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const getUserInfo = async () => {
    const res = await getUserInfoApi();
    setUserInfo(res);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className={styles.meContainer}>
      <div className={styles.basicInfo}>
        <div className={styles.avatar}>
          <img src={userInfo?.avatar} alt="avatar" />
        </div>
        <div className={styles.userBasic}>
          <div className={styles.username}>{userInfo?.username}</div>
          <div className={styles.uid}>用户号: {userInfo?.uid}</div>
        </div>
      </div>
    </div>
  );
};

export default Me;
