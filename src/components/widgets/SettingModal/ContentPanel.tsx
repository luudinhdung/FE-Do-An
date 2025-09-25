import GeneralSettings from "@/components/widgets/SettingModal/components/GeneralSettings/GeneralSettings";
import MessageSettings from "@/components/widgets/SettingModal/components/MessageSettings/MessageSettings";
import NotificationSettings from "@/components/widgets/SettingModal/components/NotificationSettings/NotificationSettings";
import ThemeSettings from "@/components/widgets/SettingModal/components/ThemeSettings/ThemeSettings";
import SecuritySettings from "@/components/widgets/SettingModal/components/SecuritySettings/SecuritySettings";
import AccountSettings from "@/components/widgets/SettingModal/components/AccountSettings/AccountSettings";

interface PropTypes {
  selected: string;
}

function ContentPanel({ selected }: PropTypes) {
  return (
    <div className="pt-3 pb-5 md:py-5 md:pt-[65px]">
      <div className="">
        {selected === "general" && <GeneralSettings />}
        {selected === "account" && <AccountSettings />}
        {selected === "theme" && <ThemeSettings />}
        {selected === "security" && <SecuritySettings />}
        {selected === "notification" && <NotificationSettings />}
        {selected === "message" && <MessageSettings />}
      </div>
    </div>
  );
}

export default ContentPanel;
