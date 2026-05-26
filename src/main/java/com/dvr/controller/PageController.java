package com.dvr.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.dvr.model.Trip;
import com.dvr.model.TripStatus;
import com.dvr.model.Vehicle;
import com.dvr.model.VehicleStatus;
import com.dvr.service.DriverService;
import com.dvr.service.TripService;
import com.dvr.service.VehicleService;


@Controller
public class PageController {
    
    @Autowired
    private DriverService driverService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private TripService tripService;
    
    /**
     * GET /
     * Dashboard home page
     * 
     * Model: Data passed to template
     * - template: "index" (maps to src/main/resources/templates/index.html)
     */
    @GetMapping("/")
    public String dashboard(Model model) {
        // Fetch statistics for dashboard
        model.addAttribute("totalDrivers", driverService.getAllDrivers().size());
        model.addAttribute("totalVehicles", vehicleService.getAllVehicles().size());
        model.addAttribute("activeTrips", tripService.getAllTrips().stream()
                .filter(t -> t.getStatus() == TripStatus.ONGOING).count());
        model.addAttribute("totalProfit", "0"); // Calculate from trips
        model.addAttribute("recentTrips", tripService.getAllTrips());
        
        return "index"; // Returns src/main/resources/templates/index.html
    }
    
    /**
     * GET /drivers
     * List all drivers page
     */
    @GetMapping("/drivers")
    public String listDrivers(Model model) {
        model.addAttribute("drivers", driverService.getAllDrivers());
        return "drivers"; // Returns src/main/resources/templates/drivers.html
    }
    
    /**
     * GET /drivers/new
     * Add new driver form page
     */
    @GetMapping("/drivers/new")
    public String addDriverForm() {
        return "driver-form"; // Returns src/main/resources/templates/driver-form.html
    }
    
    /**
     * GET /drivers/{id}
     * View individual driver details
     * 
     * @PathVariable: Extracts {id} from URL
     */
    @GetMapping("/drivers/{id}")
    public String viewDriver(@PathVariable Long id, Model model) {
        // Fetch driver details
        driverService.getDriverById(id).ifPresent(driver -> {
            model.addAttribute("driver", driver);
        });
        
        return "driver-detail"; // Returns src/main/resources/templates/driver-detail.html
    }
    
    /**
     * GET /drivers/{id}/edit
     * Edit driver form
     */
    @GetMapping("/drivers/{id}/edit")
    public String editDriverForm(@PathVariable Long id, Model model) {
        driverService.getDriverById(id).ifPresent(driver -> {
            model.addAttribute("driver", driver);
        });
        
        return "driver-form"; // Same form, but with prefilled data
    }
    
    /**
     * GET /vehicles
     * List all vehicles page
     */
    @GetMapping("/vehicles")
    public String listVehicles(Model model) {
        model.addAttribute("vehicles", vehicleService.getAllVehicles());
        model.addAttribute("drivers", driverService.getAllDrivers());
        
        return "vehicles"; // Returns src/main/resources/templates/vehicles.html
    }
    
    /**
     * GET /vehicles/new
     * Add new vehicle form with optional pre-filled data from query parameters
     * 
     * Query parameters (optional):
     * - number: Vehicle registration number
     * - model: Vehicle model
     * - currentLocation: Current location
     * - destination: Destination
     * - status: Vehicle status (IDLE, LOADING, IN_TRANSIT)
     * - driverId: Driver ID to assign
     */
    @GetMapping("/vehicles/new")
    public String addVehicleForm(
            @RequestParam(required = false) String number,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String currentLocation,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long driverId,
            Model modelObj) {
        
        modelObj.addAttribute("drivers", driverService.getAllDrivers());
        
        // Pre-fill vehicle data if query parameters are provided
        if (number != null || model != null || currentLocation != null || 
            destination != null || status != null || driverId != null) {
            Vehicle prefilledVehicle = new Vehicle();
            
            if (number != null) prefilledVehicle.setNumber(number);
            if (model != null) prefilledVehicle.setModel(model);
            if (currentLocation != null) prefilledVehicle.setCurrentLocation(currentLocation);
            if (destination != null) prefilledVehicle.setDestination(destination);
            if (status != null) {
                try {
                    prefilledVehicle.setStatus(VehicleStatus.valueOf(status.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore
                }
            }
            if (driverId != null) {
                driverService.getDriverById(driverId).ifPresent(driver -> {
                    prefilledVehicle.setDriver(driver);
                });
            }
            
            modelObj.addAttribute("vehicle", prefilledVehicle);
        }
        
        return "vehicle-form";
    }
    
    /**
     * GET /vehicles/{id}
     * View individual vehicle details
     */
    @GetMapping("/vehicles/{id}")
    public String viewVehicle(@PathVariable Long id, Model model) {
        vehicleService.getVehicleById(id).ifPresent(vehicle -> {
            model.addAttribute("vehicle", vehicle);
        });
        
        return "vehicle-detail";
    }
    
    /**
     * GET /trips
     * List all trips page
     */
    @GetMapping("/trips")
    public String listTrips(Model model) {
        model.addAttribute("trips", tripService.getAllTrips());
        
        return "trips"; // Returns src/main/resources/templates/trips.html
    }
    
    /**
     * GET /trips/new
     * Create new trip form with optional pre-filled data from query parameters
     * 
     * Query parameters (optional):
     * - vehicleId: Vehicle ID
     * - driverId: Driver ID
     * - from: Starting location
     * - to: Destination location
     * - cargo: Cargo description
     * - profit: Trip profit
     * - status: Trip status (PLANNED, ONGOING, COMPLETED)
     */
    @GetMapping("/trips/new")
    public String createTripForm(
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) Long driverId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String cargo,
            @RequestParam(required = false) Double profit,
            @RequestParam(required = false) String status,
            Model modelObj) {
        
        modelObj.addAttribute("vehicles", vehicleService.getAllVehicles());
        modelObj.addAttribute("drivers", driverService.getAllDrivers());
        
        // Pre-fill trip data if query parameters are provided
        if (vehicleId != null || driverId != null || from != null || 
            to != null || cargo != null || profit != null || status != null) {
            Trip prefilledTrip = new Trip();
            
            if (vehicleId != null) {
                vehicleService.getVehicleById(vehicleId).ifPresent(vehicle -> {
                    prefilledTrip.setVehicle(vehicle);
                });
            }
            if (driverId != null) {
                driverService.getDriverById(driverId).ifPresent(driver -> {
                    prefilledTrip.setDriver(driver);
                });
            }
            if (from != null) prefilledTrip.setFrom(from);
            if (to != null) prefilledTrip.setTo(to);
            if (cargo != null) prefilledTrip.setCargo(cargo);
            if (profit != null) prefilledTrip.setProfit(BigDecimal.valueOf(profit));
            if (status != null) {
                try {
                    prefilledTrip.setStatus(TripStatus.valueOf(status.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore
                }
            }
            
            modelObj.addAttribute("trip", prefilledTrip);
        }
        
        return "trip-form";
    }
}
