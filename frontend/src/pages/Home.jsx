import { Link } from 'react-router-dom';

function Home() {
    const features = [
        {
            icon: '🍽️',
            title: 'Restaurants',
            description: 'Manage all restaurants in the platform',
            link: '/restaurants',
            color: '#6366f1',
        },
        {
            icon: '📋',
            title: 'Orders',
            description: 'Track and manage customer orders',
            link: '/orders',
            color: '#f59e0b',
        },
        {
            icon: '🚚',
            title: 'Deliveries',
            description: 'Monitor delivery status and drivers',
            link: '/deliveries',
            color: '#10b981',
        },
        {
            icon: '⭐',
            title: 'Ratings',
            description: 'View and manage restaurant ratings',
            link: '/notes',
            color: '#ef4444',
        },
    ];

    return (
        <div className="page">
            <div className="container">
                <div className="home-hero">
                    <h1 className="home-title">
                        Food Delivery <span>Platform</span>
                    </h1>
                    <p className="home-subtitle">
                        Manage your entire food delivery ecosystem from one place
                    </p>
                </div>

                <div className="home-features">
                    {features.map((feature) => (
                        <Link to={feature.link} className="feature-card" key={feature.title}>
                            <div
                                className="feature-icon"
                                style={{ background: `${feature.color}20`, color: feature.color }}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <div className="feature-arrow" style={{ color: feature.color }}>
                                →
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="home-stats">
                    <div className="stat-card">
                        <div className="stat-icon">🌐</div>
                        <div className="stat-info">
                            <span className="stat-label">Gateway</span>
                            <span className="stat-value">localhost:8080</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-info">
                            <span className="stat-label">Services</span>
                            <span className="stat-value">4 Microservices</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-info">
                            <span className="stat-label">Discovery</span>
                            <span className="stat-value">Eureka</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .home-hero {
          text-align: center;
          padding: 4rem 0;
        }

        .home-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: var(--light);
        }

        .home-title span {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .home-subtitle {
          font-size: 1.25rem;
          color: var(--gray-400);
          max-width: 500px;
          margin: 0 auto;
        }

        .home-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature-card {
          background: rgba(30, 30, 46, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: center;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 1.5rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--light);
        }

        .feature-description {
          color: var(--gray-400);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .feature-arrow {
          font-size: 1.5rem;
          font-weight: bold;
          opacity: 0;
          transform: translateX(-10px);
          transition: var(--transition);
        }

        .feature-card:hover .feature-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .home-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          padding: 2rem 0;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(30, 30, 46, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius);
          padding: 1rem 1.5rem;
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-weight: 600;
          color: var(--light);
        }

        @media (max-width: 768px) {
          .home-title {
            font-size: 2.5rem;
          }

          .home-stats {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
        </div>
    );
}

export default Home;
