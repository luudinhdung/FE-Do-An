import { IconLockClose } from "@/data/icons";

interface PropTypes {
  className: string;
  classNameText: string;
  desc: string;
}

function MessageItem({ className, desc, classNameText }: PropTypes) {
  return (
    <div className={className}>
      <span className={classNameText}>
        {desc}
        <button className="absolute -top-[4px] -right-[9px]">
          <IconLockClose className="w-[20px] h-[20px] text-black dark:text-white" />
        </button>
      </span>
    </div>
  );
}

export default MessageItem;
