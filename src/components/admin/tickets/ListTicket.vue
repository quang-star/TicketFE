<template> 
    <div class="bottom-data">
        <div class="orders">
            <div class="header">
                <div class="left">
                    <h3>Danh sách vé</h3>
                </div>

                <div class="tools">
                    <div class="table-search">
                        <input
                            type="text"
                            placeholder="Tìm theo tên vé..."
                        >
                        <i class='bx bx-search'></i>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Mã vé</th>
                        <th>Mã đơn hàng</th>
                        <th>Sự kiện</th>
                        <th>Lịch diễn</th>
                        <th>Loại vé</th>
                        <th>Giá vé</th>
                        <th>Người mua</th>
                        <th>Trạng thái vé</th>
                        <th>Ngày mua</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#T-1001</td>
                        <td>#1024</td>
                        <td>Đêm nhạc Rock Hà Nội</td>
                        <td>20-12-2025 / 19:00-22:00</td>
                        <td>Vé VIP</td>
                        <td>500.000đ</td>
                        <td>Nguyễn Văn A</td>
                        <td><span class="status completed">Hợp lệ</span></td>
                        <td>27-11-2025</td>
                    </tr>

                    <tr>
                        <td>#T-1002</td>
                        <td>#1025</td>
                        <td>Workshop UI/UX</td>
                        <td>05-01-2026 / 09:00-12:00</td>
                        <td>Vé thường</td>
                        <td>150.000đ</td>
                        <td>Trần Thị B</td>
                        <td><span class="status process">Đã sử dụng</span></td>
                        <td>27-11-2025</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>

<script>

</script>