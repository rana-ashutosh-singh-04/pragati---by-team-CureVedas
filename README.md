# AdarshGramGapFinder 🌾

A comprehensive full-stack web application to identify infrastructure gaps in SC-majority villages for Adarsh Gram declaration. This platform helps district officers and policymakers make data-driven decisions for village development.

## 🎯 Features

### Core Functionality
- **Interactive Village Mapping**: Visualize SC-majority villages on Google Maps with color-coded gap scores
- **Gap Analysis**: Comprehensive scoring system for infrastructure and amenities
- **Data Upload**: Support for CSV and GeoJSON file uploads to update village data
- **Priority Ranking**: AI-powered recommendations for intervention prioritization
- **Detailed Village Profiles**: Drill-down modals with gap analysis and recommendations

### Infrastructure Categories
- 🏫 **Education**: Schools, Anganwadi centers, educational facilities
- 🏥 **Healthcare**: Health centers, medical facilities, ASHA workers
- 💧 **Water Supply**: Hand pumps, piped water, water tanks
- 🚿 **Sanitation**: Individual/community toilets, waste management
- ⚡ **Electricity**: Power connections, street lights, solar power
- 🛣️ **Roads & Transport**: Paved roads, internal roads, bus connectivity
- 📡 **Connectivity**: Mobile networks, internet, postal services
- 🏦 **Banking**: Bank branches, ATMs, banking correspondents
- 🛒 **Market & Commerce**: Weekly markets, fair price shops, cooperative stores

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for responsive, modern UI
- **Google Maps API** for interactive mapping
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **CSV Parser** for data processing
- **Nodemailer** for OTP emails
- **Bcrypt** for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Maps API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd adarsh-gram-gap-finder
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Configuration

#### Backend (.env)
```bash
cd server
cp env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/adarsh-gram-gap-finder
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

#### Frontend (.env)
```bash
cd client
cp env.example .env
```

Edit `client/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
cd server
node seeders/seedVillages.js
```

### 5. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

## 🔑 Authentication

### Demo Credentials
- **Admin User**: `admin@adarshgram.gov.in` / `password`
- **District Officer**: `officer@district1.gov.in` / `password`

### Features
- JWT-based authentication
- Password reset with OTP
- Role-based access control
- Session management

## 📊 Data Schema

### Village Model
```javascript
{
  name: String,
  district: String,
  state: String,
  pincode: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  population: {
    total: Number,
    scPopulation: Number,
    scPercentage: Number
  },
  amenities: {
    education: [Amenity],
    healthcare: [Amenity],
    water: [Amenity],
    sanitation: [Amenity],
    electricity: [Amenity],
    roads: [Amenity],
    connectivity: [Amenity],
    banking: [Amenity],
    market: [Amenity]
  },
  gapScore: Number,
  priorityRank: Number,
  adarshGramStatus: String, // 'declared', 'in-progress', 'not-started'
  lastUpdated: Date,
  createdBy: String
}
```

### Amenity Model
```javascript
{
  name: String,
  available: Boolean,
  quality: String, // 'excellent', 'good', 'fair', 'poor'
  distance: Number,
  notes: String
}
```

## 📁 File Upload Formats

### CSV Format
Required columns:
- `name`, `district`, `state`, `latitude`, `longitude`
- `totalPopulation`, `scPopulation`
- Optional: `pincode`, `adarshGramStatus`, `amenities`

### GeoJSON Format
Standard GeoJSON FeatureCollection with Point geometries and village properties.

## 🎨 Gap Score Calculation

The gap score is calculated using a weighted algorithm:

```javascript
// Category weights
const weights = {
  education: 0.15,
  healthcare: 0.20,
  water: 0.15,
  sanitation: 0.10,
  electricity: 0.10,
  roads: 0.10,
  connectivity: 0.10,
  banking: 0.05,
  market: 0.05
}

// Score ranges
0-25%: Excellent (Green)
26-50%: Good (Blue)
51-75%: Fair (Amber)
76-100%: Poor (Red)
```

## 🗺️ Google Maps Integration

### Setup
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Add the API key to your environment variables

### Features
- Interactive village markers with color coding
- Info windows with village details
- Clustering for better performance
- Responsive design for mobile devices

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers (1920px+)
- Tablets (768px - 1024px)
- Mobile phones (320px - 768px)
- Low-bandwidth connections

## 🔧 API Endpoints

### Villages
- `GET /api/villages` - List villages with filtering
- `GET /api/villages/:id` - Get village details
- `GET /api/villages/stats/summary` - Get statistics
- `POST /api/villages` - Create village
- `PUT /api/villages/:id` - Update village

### Upload
- `POST /api/upload/csv` - Upload CSV file
- `POST /api/upload/geojson` - Upload GeoJSON file

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send password reset OTP
- `POST /api/auth/verify-otp` - Verify OTP and reset password
- `GET /api/auth/profile` - Get user profile

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd server
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use secure MongoDB connection string
- Use strong JWT secret
- Configure proper email settings
- Set up Google Maps API with domain restrictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Adarsh Gram Yojana** for the inspiration
- **Google Maps** for mapping services
- **React Community** for excellent libraries
- **TailwindCSS** for the design system

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for rural development and social justice**




