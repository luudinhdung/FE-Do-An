interface PropTypes {
  image: string;
  name?: string;
  desc?: string;
  time?: string;
  isActive?: boolean;
  onClick?: () => void;
}

function UserItem({ image, name, time, isActive, onClick }: PropTypes) {
  
  return (
    <div
  className={
    isActive
      ? "flex py-2 px-8 bg-[#3A3F47] dark:bg-[#183A2D] font-mono"
      : "flex py-2 px-8 rounded-xl font-mono"
  }
  onClick={onClick}
  style={{ cursor: onClick ? "pointer" : undefined }}
>
  {/* User Avatar */}
  <div className="w-[48px] h-[48px] flex-shrink-0">
    <img
      className="w-10 h-10 object-cover bg-center rounded-full"
      src={image}
      alt=""
    />
  </div>

  {/* User Info */}
  <div className="ml-2 text-[15px] text-[#ffffff] dark:text-[#1AFF1A] font-normal flex flex-col gap-y-2">
    <div className="w-[240px] overflow-hidden">
      <h3 className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden text-left leading-[1.3]">
        {name}
      </h3>
    </div>

    <div className="flex items-center gap-x-1 text-[13px] opacity-80">
      {/* Nội dung tạm: nếu có thời gian hoặc trạng thái thì hiển thị ở đây */}
      ******
    </div>

    {/* Nếu muốn bật hiển thị thời gian thì bỏ comment ở dưới */}
    {/* <div className="flex items-center gap-x-1">
      <Clock />
      <span className="text-[13px] text-[#007A5E] dark:text-[#87FFB5] leading-[1.3]">
        Thời gian còn lại: {time}
      </span>
    </div> */}
  </div>
</div>

  );
}

export default UserItem;
