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
https://github.com/WiraAtma/backend-cinema-booking
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
prisma migrate dev
```

Create Seeder :
```bash
npx prisma db seed
```

URL API:
- Films :
    - Get All Film :
        ```bash
        http://<your_local_host>/api/films
        ```
- Seats :
    - Get Seat Status :
       ```bash
        http://<your_local_host>/api/seats/<scheduleId>
        ``` 
        Note : ScheduleId Example : 1, 2, etc.