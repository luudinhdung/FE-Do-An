export default function ChatsTab() {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Quản lý Chat</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Phòng</th>
                <th className="p-2 border">Người tham gia</th>
                <th className="p-2 border">Tin nhắn cuối</th>
                <th className="p-2 border">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-2 border">Room 1</td>
                <td className="p-2 border">User A, User B</td>
                <td className="p-2 border">Hello 👋</td>
                <td className="p-2 border">2025-08-25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  