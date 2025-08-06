const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const ZedForexToken = require('./models/ZedForexToken');
const ZedInvestBusiness = require('./models/ZedInvestBusiness');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await ZedForexToken.deleteMany({});
    await ZedInvestBusiness.deleteMany({});

    // Create admin user
    const adminUser = new User({
      email: 'admin@zedhustle.com',
      password: 'admin123',
      phone: '+260955123456',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        age: 30,
        location: 'Lusaka, Zambia',
        workCategory: 'technology',
        experience: 'specialized'
      },
      role: 'admin',
      emailVerified: true,
      phoneVerified: true,
      premiumPlan: 'k100'
    });
    await adminUser.save();

    // Create sample user
    const user = new User({
      email: 'john@example.com',
      password: 'password123',
      phone: '+260955123457',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        location: 'Kitwe, Zambia',
        workCategory: 'technology',
        experience: 'mid'
      },
      premiumPlan: 'k50'
    });
    await user.save();

    // Create ZedForex tokens
    const tokens = [
      {
        symbol: 'COPPER',
        name: 'Zambian Copper Token',
        commodity: 'copper',
        currentPrice: 8500,
        previousPrice: 8400,
        totalSupply: 1000000,
        circulatingSupply: 750000,
        isFeatured: true
      },
      {
        symbol: 'GOLD',
        name: 'Zambian Gold Token',
        commodity: 'gold',
        currentPrice: 125000,
        previousPrice: 124000,
        totalSupply: 500000,
        circulatingSupply: 300000,
        isFeatured: true
      }
    ];

    for (const tokenData of tokens) {
      const token = new ZedForexToken(tokenData);
      await token.save();
    }

    // Create ZedInvest business
    const business = new ZedInvestBusiness({
      name: 'Lusaka Tech Solutions',
      description: 'Innovative technology solutions for Zambian businesses',
      category: 'technology',
      owner: user._id,
      location: 'Lusaka, Zambia',
      established: new Date('2020-01-15'),
      totalValue: 500000,
      tokensIssued: 10000,
      tokensAvailable: 7500,
      tokenPrice: 50,
      minInvestment: 100,
      maxInvestment: 10000,
      expectedReturn: 25,
      status: 'active',
      isFeatured: true,
      isVerified: true
    });
    await business.save();

    console.log('✅ Database seeding completed!');
    console.log('👥 Users: 2 (admin + sample)');
    console.log('💰 ZedForex Tokens: 2');
    console.log('🏢 ZedInvest Businesses: 1');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData(); 