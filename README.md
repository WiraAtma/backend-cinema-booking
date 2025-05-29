# Ipaymu Backend Test

Sistem Pemesanan Kursi Bioskop

### Fitur Utama:
- Pengguna dapat melihat daftar film dan jam tayang.
- Pengguna dapat memilih dan memesan kursi tertentu untuk jadwal tayang tertentu.
- Satu kursi hanya boleh dipesan oleh satu orang, dan tidak boleh terjadi pemesanan ganda walaupun banyak pengguna menekan "pesan" secara bersamaan.
- Terdapat fitur **lock kursi sementara** untuk menjaga ketersediaan sebelum pembayaran berhasil.

**Server:** Express Js 5, MySQL, Prisma

## Installation

Clone Repository:

```bash
git clone https://github.com/WiraAtma/backend-cinema-booking
```

Navigate to Project Directory:

```bash
cd backend-cinema-booking
```

Install Express:

```bash
npm install express
```

(Opsional) Install nodemon untuk development agar server restart otomatis:
```bash
npm install --save-dev nodemon
```

Copy Environment File:

```bash
cp .env.example .env
```

Configure Database:

-   Open .env file and set your database connection details.

    ```bash
    DATABASE_URL="mysql://your_database_username:your_database_password@localhost:5432/your_database_name?schema=public"
    ```

    Note: Replace your_database_name, your_database_username, and your_database_password with your actual database name, username, and password.

-   Save the changes to the .env file.

Prisma Generate:

```bash
npx prisma generate
```

Create Migration:

```bash
npx prisma migrate dev
```

Create Seeder :
```bash
npx prisma db seed
```

Run Local Host :
- ```bash
    npm run start
    ```
- (opsional) gunakan jika sudah menginstall nodemon untuk development agar server restart otomatis:
    ```bash
    npm run dev
    ```

API :
- Films :
    - GET All Film :
        Mengambil semua daftar film beserta jam tayang dan jam selesai tayang
        ```bash
        http://<your_local_host>/api/films
        ```

- Seats :
    - GET Seat Status :
        Mengambil daftar status kursi pada setiap film sesuai dengan scheduleId
       ```bash
        http://<your_local_host>/api/seats/<scheduleId>
        ``` 
        Note : ScheduleId Example : 1, 2, etc.
        
- Bookings :
    - POST Booking Status :
        Memesan kursi user dan akan mengunci kursi secara sementara / menunggu konfirmasi dari sistem

        ```bash
            http://<your_local_host>/api/bookings
        ``` 
        ```json
            {
                "filmId" : your_film_id,
                "seatId" : your_seat_id,
                "scheduleId": your_schedule_id,
                "userName": "your_input_request"
            }
        ```
        Note: Replace your_film_id, your_seat_id, and your_schedule_id with your actual database film.id, seat.id, and schedule.id.

    - POST Booking Confirmed :
        Memberikan Konfirmasi ke sistem kalau kursi tersebut
        
        ```bash
            http://<your_local_host>/api/booking/confirm
        ```
        ```json
            {
                "scheduleId": your_schedule_id
            }
        ```
        Note: Replace your_schedule_id with your actual database scheduleSeat.id and Before You Send This Request You Must Send Request For Booking Status First.


    