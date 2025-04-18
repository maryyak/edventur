import { Typography } from "antd";
import {useUserInfo} from "../context/UserInfoContext";

/** Ссылка с почтой, которая при клике формирует письмо на почту с контактами пользователя */
const ContactsMailLinkWrapper = ({children}) => {
    const { userInfo } = useUserInfo();

    return (
        <Typography.Paragraph
            style={{
                margin: 0,
                display: "inline",
            }}
        >
            <a
                href={`mailto:admin@admin.ru?subject=${encodeURIComponent(
                    `, ${userInfo?.username}`
                )}&body=${encodeURIComponent(`
          
          
          
          
--
ФИО: ${userInfo?.username}
Идентификатор: ${userInfo?.id || ""}
Email: ${userInfo?.email || ""}
`)}`}
            >
                {children}
            </a>
        </Typography.Paragraph>
    );
}

export default ContactsMailLinkWrapper
