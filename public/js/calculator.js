// public/js/calculator.js

/**
 * Calculates the monthly USD cost for a single service instance.
 * @param {Object} serviceData - The metadata of the service from prices.json
 * @param {Object} inputs - The user inputs (e.g., { instances: 2, hours: 730 })
 * @param {Number} regionMultiplier - The multiplier for the selected region
 * @returns {Number} - The total monthly cost in USD
 */
export function calculateServiceCost(serviceData, inputs, regionMultiplier = 1.00) {
  if (!serviceData) return 0;
  
  const basePrice = serviceData.base;
  const serviceId = serviceData.id;
  let cost = 0;

  // Helper to safely get numbers
  const qty = (val) => parseFloat(val) || 0;
  const hours = (val) => parseFloat(val) || 730;

  // Custom logic for specific services based on their pricing units
  switch (serviceId) {
    case 'ec2':
    case 'rds':
      // Base price is Hourly
      cost = basePrice * qty(inputs.instances || 1) * hours(inputs.hours);
      break;
      
    case 'aurora':
      // Base price is Hourly per instance
      cost = basePrice * qty(inputs.instances || 1) * hours(inputs.hours);
      break;

    case 'elb':
    case 'elasticache':
      // Base price is Hourly. (elb uses 'lbs', elasticache uses 'nodes' as keys in the UI)
      const elbQty = inputs.instances || inputs.lbs || inputs.nodes || 1;
      cost = basePrice * qty(elbQty) * hours(inputs.hours);
      break;
      
    case 'lambda':
      // Example: Requests (in millions) * base + GB-seconds
      cost = (basePrice * qty(inputs.requests)) + (0.00001667 * qty(inputs.gbSeconds));
      break;
      
    case 's3':
    case 'ebs':
    case 'efs':
    case 'glacier':
    case 'cloudfront':
      // Base price is per GB
      cost = basePrice * qty(inputs.gb);
      break;
      
    case 'lightsail':
      // Base price is per instance/month
      cost = basePrice * qty(inputs.instances || 1);
      break;

    case 'dynamodb':
      // Base price is per RCU/WCU. (Assuming base is per hour for requested capacity)
      // Formula: (Reads + Writes) * Base Price * 730 hours
      cost = basePrice * (qty(inputs.reads) + qty(inputs.writes)) * 730;
      break;

    case 'route53':
      // Base price per hosted zone
      cost = basePrice * qty(inputs.zones || 1);
      break;

    case 'cloudwatch':
      // Base price per metric
      cost = basePrice * qty(inputs.metrics);
      break;

    case 'sns':
      // Base price per 1M notifications
      cost = basePrice * qty(inputs.notifications);
      break;

    case 'sqs':
      // Base price per 1M requests
      cost = basePrice * qty(inputs.requests);
      break;

    case 'cognito':
      // Base price per MAU
      cost = basePrice * qty(inputs.mau);
      break;

    case 'apigateway':
      // Base price per 1M calls
      cost = basePrice * qty(inputs.calls);
      break;
      
    default:
      // Fallback: simple multiplication if unit is unknown
      cost = basePrice;
  }

  // Apply region multiplier and round to 2 decimals
  return Math.round((cost * regionMultiplier) * 100) / 100;
}

/**
 * Calculates total cost across all active services.
 * @param {Array} services - Array of active service instances
 * @param {Object} pricesData - The full prices.json data
 * @param {Object} regionsData - The full regions.json data
 * @returns {Object} - Totals: { totalMonthly, breakdown: [] }
 */
export function calculateTotal(services, pricesData, regionsData) {
  let totalMonthly = 0;
  const breakdown = [];

  services.forEach(svc => {
    // Get metadata from prices.json
    const priceMeta = pricesData.services[svc.id];
    if (!priceMeta) return; // Skip if service data is missing

    // Get region multiplier (default to 1.00 if not found)
    const regionMeta = regionsData.regions.find(r => r.id === svc.region) || { multiplier: 1.00 };
    
    // Ensure we have a default structure for inputs
    const safeInputs = svc.inputs || {};

    // Calculate cost for this specific service
    const cost = calculateServiceCost(
      { ...priceMeta, id: svc.id }, 
      safeInputs, 
      regionMeta.multiplier
    );

    totalMonthly += cost;
    
    // Push to breakdown list
    breakdown.push({
      id: svc.uid, // unique id for UI mapping
      name: svc.name,
      cost: cost
    });
  });

  // Sort breakdown descending by cost
  breakdown.sort((a, b) => b.cost - a.cost);

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    breakdown
  };
}