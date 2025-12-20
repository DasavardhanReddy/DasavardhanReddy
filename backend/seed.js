require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
.then(async ()=>{
  console.log('connected, seeding...');
  await Vehicle.deleteMany({});
  await Driver.deleteMany({});

  // create drivers
  const drivers = await Driver.create([
    {
      name: 'Ravi', phone: '9000000001', currentPlace: 'Depot A',
      currentLocation: { type: 'Point', coordinates: [72.8777, 19.0760] },
      travelHistory: [ { placeName: 'Depot A', coords: { type: 'Point', coordinates: [72.8777, 19.0760] }, note: 'Started shift' } ]
    },
    {
      name: 'Suresh', phone: '9000000002', currentPlace: 'Highway 4',
      currentLocation: { type: 'Point', coordinates: [73.8567, 18.5204] },
      travelHistory: [ { placeName: 'Highway 4', coords: { type: 'Point', coordinates: [73.8567, 18.5204] }, note: 'En route' } ]
    },
    {
      name: 'Ajay', phone: '9000000003', currentPlace: 'City Center',
      currentLocation: { type: 'Point', coordinates: [72.6450, 19.2280] },
      travelHistory: [ { placeName: 'City Center', coords: { type: 'Point', coordinates: [72.6450, 19.2280] }, note: 'Delivery completed' } ]
    }
  ]);

  // create 20 vehicles (you can increase number)
  const vehicles = [];
  for(let i=1;i<=20;i++){
    vehicles.push({
      number: `MH12AB${100+i}`, 
      model: `Truck-${i%5}`,
      currentLocation: `Depot ${Math.ceil(i/5)}`,
      destination: `City ${i%6}`,
      status: i%3===0 ? 'in-transit' : 'idle',
      driver: drivers[i%drivers.length]._id,
      history: []
    });
  }
  await Vehicle.create(vehicles);

  // assign vehicles to drivers
  const allV = await Vehicle.find();
  for(let i=0;i<allV.length;i++){
    const drv = drivers[i % drivers.length];
    if(!drv.assignedVehicles) drv.assignedVehicles=[];
    drv.assignedVehicles.push(allV[i]._id);
    await drv.save();
  }

  // seed a few chat messages for demo
  const Message = require('./models/Message');
  await Message.deleteMany({});
  await Message.create([
    { senderName: 'Ravi', senderRole: 'driver', text: 'Departing depot now.', vehicle: allV[0]._id },
    { senderName: 'Owner', senderRole: 'owner', text: 'Be careful on route.', vehicle: allV[0]._id },
    { senderName: 'Suresh', senderRole: 'driver', text: 'ETA 2 hours, traffic is light.', vehicle: allV[5]._id }
  ]);

  console.log('Seed completed');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
