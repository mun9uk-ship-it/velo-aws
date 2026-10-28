// public/js/ui.js

import { formatPrice } from './currency.js';
import { t } from './i18n.js';
import { calculateTotal } from './calculator.js';

const categoriesContainer = document.getElementById('categories');
const cardsContainer = document.getElementById('serviceCards');
const emptyState = document.getElementById('emptyState');
const monthlyTotalEl = document.getElementById('monthlyTotal');
const yearlyTotalEl = document.getElementById('yearlyTotal');
const breakdownListEl = document.getElementById('breakdownList');
const vatToggle = document.getElementById('vatToggle');
const globalSearch = document.getElementById('globalSearch');

let servicesData = null;
let pricesData = null;
let regionsData = null;
let activeServices = [];
let vatEnabled = false;

// Fixed Shortcuts: Unique keys for every service
const shortcutMap = {
  'ec2': 'E', 'lambda': 'L', 'ecs': 'K', 'lightsail': 'I',
  's3': 'S', 'ebs': 'B', 'efs': 'F', 'glacier': 'G',
  'rds': 'R', 'dynamodb': 'D', 'aurora': 'A', 'elasticache': 'H',
  'cloudfront': 'O', 'route53': 'Z', 'elb': 'W',
  'cloudwatch': 'M', 'sns': 'N', 'sqs': 'Q', 'cognito': 'U', 'apigateway': 'P',
  'acm': 'C'
};

const searchDictionary = [
  { terms: ['hosting', 'web server', 'website', 'frontend', 'vm', 'virtual machine'], target: 'EC2', advice: 'Amazon EC2 provides scalable virtual servers in the cloud.', equivalents: { gcp: 'Compute Engine', azure: 'Virtual Machines' } },
  { terms: ['file storage', 'object storage', 'files', 'images', 'bucket'], target: 'S3', advice: 'Amazon S3 is highly durable object storage for any type of data.', equivalents: { gcp: 'Cloud Storage', azure: 'Blob Storage' } },
  { terms: ['database', 'sql', 'mysql', 'postgres', 'relational'], target: 'RDS', advice: 'Amazon RDS makes it easy to set up and scale a relational database.', equivalents: { gcp: 'Cloud SQL', azure: 'Azure SQL Database' } },
  { terms: ['nosql', 'key-value', 'document database', 'dynamo'], target: 'DynamoDB', advice: 'Amazon DynamoDB is a fast, flexible NoSQL database service.', equivalents: { gcp: 'Firestore / Bigtable', azure: 'Cosmos DB' } },
  { terms: ['cdn', 'content delivery', 'cache', 'edge'], target: 'CloudFront', advice: 'Amazon CloudFront is a fast content delivery network (CDN).', equivalents: { gcp: 'Cloud CDN', azure: 'Azure CDN / Front Door' } },
  { terms: ['dns', 'domain name', 'routing', 'route 53'], target: 'Route 53', advice: 'Amazon Route 53 is a highly available DNS web service.', equivalents: { gcp: 'Cloud DNS', azure: 'Azure DNS' } },
  { terms: ['serverless', 'function', 'microservices', 'lambda'], target: 'Lambda', advice: 'AWS Lambda lets you run code without provisioning servers.', equivalents: { gcp: 'Cloud Run functions', azure: 'Azure Functions' } },
  { terms: ['kubernetes', 'container', 'orchestration'], target: 'ECS Fargate', advice: 'AWS ECS/Fargate runs containers without managing servers.', equivalents: { gcp: 'GKE / Cloud Run', azure: 'AKS / Container Apps' } },
  { terms: ['queue', 'messaging', 'sqs'], target: 'SQS', advice: 'Amazon SQS is a fully managed message queuing service.', equivalents: { gcp: 'Pub/Sub', azure: 'Service Bus' } },
  { terms: ['monitoring', 'logs', 'metrics', 'cloudwatch'], target: 'CloudWatch', advice: 'Amazon CloudWatch monitors your AWS resources and applications.', equivalents: { gcp: 'Cloud Monitoring / Logging', azure: 'Azure Monitor' } },
  { terms: ['top bar security lock', 'security lock', 'padlock', 'lock icon', 'https lock', 'browser lock', 'acm', 'ssl', 'certificate'], target: 'ACM', advice: 'AWS Certificate Manager (ACM) provides the SSL/TLS certificates that create the security lock (padlock icon) in the browser.', equivalents: { gcp: 'Certificate Authority Service', azure: 'App Service Certificates' } }
];

export function initUI(data) {
  servicesData = data.services;
  pricesData = data.prices;
  regionsData = data.regions;
  
  vatToggle.addEventListener('change', (e) => {
    vatEnabled = e.target.checked;
    updateSummary();
  });

  globalSearch?.addEventListener('input', (e) => {
    handleGlobalSearch(e.target.value.toLowerCase().trim());
  });

  globalSearch?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      globalSearch.value = '';
      handleGlobalSearch('');
    }
  });

  renderSidebar();
  renderWorkspace();
}

export function setServices(newServices) {
  activeServices = newServices;
  renderWorkspace();
}

export function addServiceById(id) {
  if (!servicesData) return;
  for (const cat of servicesData.categories) {
    const svc = cat.services.find(s => s.id === id);
    if (svc) {
      addService(svc);
      return;
    }
  }
}

function renderSidebar() {
  if (!servicesData) return;
  categoriesContainer.innerHTML = '';

  servicesData.categories.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';
    
    const catTitle = document.createElement('div');
    catTitle.className = 'category-name';
    catTitle.textContent = cat.name;
    catDiv.appendChild(catTitle);

    cat.services.forEach(svc => {
      const shortcutKey = shortcutMap[svc.id] || '?';
      const item = document.createElement('div');
      item.className = 'service-item';
      
      item.innerHTML = `
        <div class="si-icon">${svc.icon}</div>
        <div class="si-name">${svc.name}</div>
        <div class="si-shortcut">Ctrl + ${shortcutKey}</div>
        <div class="si-price">+</div>
      `;
      item.addEventListener('click', () => addService(svc));
      catDiv.appendChild(item);
    });

    categoriesContainer.appendChild(catDiv);
  });
}

function handleGlobalSearch(query) {
  if (!query) {
    renderWorkspace(); 
    return;
  }

  const matchedServices = [];
  servicesData.categories.forEach(cat => {
    cat.services.forEach(svc => {
      if (svc.name.toLowerCase().includes(query) || svc.desc.toLowerCase().includes(query)) {
        matchedServices.push(svc);
      }
    });
  });

  const dictMatches = searchDictionary.filter(dictItem => 
    dictItem.terms.some(term => term.includes(query) || query.includes(term))
  );

  emptyState.style.display = 'none';
  cardsContainer.style.display = 'flex';
  cardsContainer.innerHTML = '';

  if (matchedServices.length === 0 && dictMatches.length === 0) {
    cardsContainer.innerHTML = `<div class="empty-state"><p>No results found for "${query}"</p></div>`;
    return;
  }

  const highlight = (text) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  dictMatches.forEach(match => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.style.borderColor = 'var(--accent)';
    
    let linkedService = null;
    servicesData.categories.forEach(cat => {
      const found = cat.services.find(s => s.name.includes(match.target));
      if (found) linkedService = found;
    });

    const gcpIcon = `<img src="https://cdn.simpleicons.org/googlecloud/white" width="16" height="16" alt="GCP" style="vertical-align:middle; margin-right:4px;">`;
    const azureIcon = `<img src="https://cdn.simpleicons.org/microsoftazure/white" width="16" height="16" alt="Azure" style="vertical-align:middle; margin-right:4px;">`;
    const serviceIcon = linkedService ? `<div class="sc-icon">${linkedService.icon}</div>` : `<div class="sc-icon" style="background:var(--accent)">💡</div>`;

    card.innerHTML = `
      <div class="sc-head">
        ${serviceIcon}
        <div style="flex:1">
          <div class="sc-title">Looking for ${highlight(query)}?</div>
          <div class="sc-sub" style="color:var(--text); margin-bottom: 8px;">${match.advice}</div>
          
          <div style="display: flex; gap: 16px; font-size: 12px; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 6px 10px; border-radius: 6px;">
            <span style="display:flex; align-items:center;">${gcpIcon} GCP: ${match.equivalents.gcp}</span>
            <span style="display:flex; align-items:center;">${azureIcon} Azure: ${match.equivalents.azure}</span>
          </div>
        </div>
        <button class="btn btn-primary" style="margin-left:auto; min-height:36px; padding:4px 12px; white-space:nowrap;">Add ${match.target}</button>
      </div>
    `;
    
    if (linkedService) {
      card.querySelector('button').addEventListener('click', () => {
        addService(linkedService);
        globalSearch.value = '';
        handleGlobalSearch('');
      });
    } else {
      card.querySelector('button').style.display = 'none';
    }
    
    cardsContainer.appendChild(card);
  });

  matchedServices.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
      <div class="sc-head">
        <div class="sc-icon">${svc.icon}</div>
        <div>
          <div class="sc-title">${highlight(svc.name)}</div>
          <div class="sc-sub">${highlight(svc.desc)}</div>
        </div>
        <button class="btn btn-ghost" style="margin-left:auto; min-height:36px; padding:4px 12px;">Add Service</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => {
      addService(svc);
      globalSearch.value = '';
      handleGlobalSearch('');
    });
    cardsContainer.appendChild(card);
  });
}

function addService(svcMeta) {
  const newService = {
    uid: crypto.randomUUID(),
    id: svcMeta.id,
    name: svcMeta.name,
    icon: svcMeta.icon,
    region: 'us-east-1',
    inputs: {}
  };

  if (['ec2', 'rds'].includes(svcMeta.id)) {
    newService.inputs = { instances: 1, hours: 730 };
  } else if (['s3', 'ebs', 'efs', 'glacier', 'cloudfront'].includes(svcMeta.id)) {
    newService.inputs = { gb: 100 };
  } else if (['lightsail', 'aurora', 'elb', 'elasticache'].includes(svcMeta.id)) {
    newService.inputs = { instances: 1, hours: 730 };
  } else if (['dynamodb'].includes(svcMeta.id)) {
    newService.inputs = { writes: 10, reads: 10 };
  } else if (['cloudwatch'].includes(svcMeta.id)) {
    newService.inputs = { metrics: 10 };
  } else if (['route53'].includes(svcMeta.id)) {
    newService.inputs = { zones: 1 };
  } else if (['acm'].includes(svcMeta.id)) {
    newService.inputs = { certs: 1 };
  } else {
    newService.inputs = { value: 1 }; 
  }

  activeServices.push(newService);
  
  if (globalSearch.value) {
    globalSearch.value = '';
    handleGlobalSearch('');
  } else {
    renderWorkspace();
  }
}

function renderWorkspace() {
  if (activeServices.length === 0) {
    emptyState.style.display = 'block';
    cardsContainer.style.display = 'none';
    updateSummary();
    return;
  }

  emptyState.style.display = 'none';
  cardsContainer.style.display = 'flex';
  cardsContainer.innerHTML = '';

  activeServices.forEach(svc => {
    const priceMeta = pricesData.services[svc.id];
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.uid = svc.uid;

    let fieldsHTML = '';
    const regionOptions = regionsData.regions.map(r => 
      `<option value="${r.id}" ${svc.region === r.id ? 'selected' : ''}>${r.name}</option>`
    ).join('');

    fieldsHTML += `
      <div class="field">
        <label>Region</label>
        <select class="input-region">${regionOptions}</select>
      </div>
    `;

    if (svc.id === 'ec2' || svc.id === 'rds') {
      fieldsHTML += `
        <div class="field">
          <label>Instances</label>
          <input type="number" min="1" class="input-qty" data-key="instances" value="${svc.inputs.instances}">
        </div>
        <div class="field">
          <label>Hours / month</label>
          <input type="number" min="1" max="730" class="input-qty" data-key="hours" value="${svc.inputs.hours}">
        </div>
      `;
    } else if (['s3', 'ebs', 'efs', 'glacier', 'cloudfront'].includes(svc.id)) {
      fieldsHTML += `
        <div class="field">
          <label>Storage / Transfer (GB)</label>
          <input type="number" min="0" class="input-qty" data-key="gb" value="${svc.inputs.gb}">
        </div>
      `;
    } else if (['lightsail', 'aurora', 'elb', 'elasticache'].includes(svc.id)) {
      fieldsHTML += `
        <div class="field">
          <label>Quantity</label>
          <input type="number" min="1" class="input-qty" data-key="instances" value="${svc.inputs.instances || 1}">
        </div>
        <div class="field">
          <label>Hours / month</label>
          <input type="number" min="1" max="730" class="input-qty" data-key="hours" value="${svc.inputs.hours || 730}">
        </div>
      `;
    } else if (svc.id === 'dynamodb') {
      fieldsHTML += `
        <div class="field">
          <label>Read Capacity Units</label>
          <input type="number" min="0" class="input-qty" data-key="reads" value="${svc.inputs.reads || 0}">
        </div>
        <div class="field">
          <label>Write Capacity Units</label>
          <input type="number" min="0" class="input-qty" data-key="writes" value="${svc.inputs.writes || 0}">
        </div>
      `;
    } else if (svc.id === 'cloudwatch') {
      fieldsHTML += `
        <div class="field">
          <label>Number of Metrics</label>
          <input type="number" min="0" class="input-qty" data-key="metrics" value="${svc.inputs.metrics || 0}">
        </div>
      `;
    } else if (svc.id === 'route53') {
      fieldsHTML += `
        <div class="field">
          <label>Hosted Zones</label>
          <input type="number" min="1" class="input-qty" data-key="zones" value="${svc.inputs.zones || 1}">
        </div>
      `;
    } else if (svc.id === 'acm') {
      fieldsHTML += `
        <div class="field">
          <label>Number of Certificates</label>
          <input type="number" min="1" class="input-qty" data-key="certs" value="${svc.inputs.certs || 1}">
          <span class="hint">Public certificates are free in AWS</span>
        </div>
      `;
    } else {
      fieldsHTML += `
        <div class="field">
          <label>Quantity</label>
          <input type="number" min="0" class="input-qty" data-key="value" value="${svc.inputs.value || 1}">
        </div>
      `;
    }

    card.innerHTML = `
      <div class="sc-head">
        <div class="sc-icon">${svc.icon}</div>
        <div>
          <div class="sc-title">${svc.name}</div>
          <div class="sc-sub">${priceMeta.unit}</div>
        </div>
        <div class="sc-price">$0.00</div>
        <button class="sc-remove" aria-label="Remove service">✕</button>
      </div>
      <div class="sc-grid">
        ${fieldsHTML}
      </div>
    `;

    card.querySelector('.sc-remove').addEventListener('click', () => {
      activeServices = activeServices.filter(s => s.uid !== svc.uid);
      renderWorkspace();
    });

    card.querySelector('.input-region').addEventListener('change', (e) => {
      svc.region = e.target.value;
      updateSummary();
    });

    card.querySelectorAll('.input-qty').forEach(input => {
      input.addEventListener('input', (e) => {
        const key = e.target.dataset.key;
        svc.inputs[key] = parseFloat(e.target.value) || 0;
        updateSummary();
      });
    });

    cardsContainer.appendChild(card);
  });

  updateSummary();
}

function updateSummary() {
  if (!pricesData || !regionsData) return;

  const { totalMonthly, breakdown } = calculateTotal(activeServices, pricesData, regionsData);

  const vatMultiplier = vatEnabled ? 1.2 : 1;
  const finalMonthly = totalMonthly * vatMultiplier;
  const finalYearly = finalMonthly * 12;

  monthlyTotalEl.textContent = formatPrice(finalMonthly);
  yearlyTotalEl.textContent = formatPrice(finalYearly);

  activeServices.forEach(svc => {
    const item = breakdown.find(b => b.id === svc.uid);
    if (item) {
      const card = document.querySelector(`.service-card[data-uid="${svc.uid}"]`);
      if (card) {
        card.querySelector('.sc-price').textContent = formatPrice(item.cost * vatMultiplier);
      }
    }
  });

  breakdownListEl.innerHTML = '';
  const maxCost = Math.max(...breakdown.map(b => b.cost), 1);

  breakdown.forEach(item => {
    const costWithVat = item.cost * vatMultiplier;
    const percent = (item.cost / maxCost) * 100;
    
    const li = document.createElement('li');
    li.className = 'bd-row';
    li.innerHTML = `
      <div class="bd-top">
        <span class="bd-name">${item.name}</span>
        <span class="bd-price">${formatPrice(costWithVat)}</span>
      </div>
      <div class="bd-bar">
        <div class="bd-bar-fill" style="width: ${percent}%"></div>
      </div>
    `;
    breakdownListEl.appendChild(li);
  });
}

export function generatePrintLayout(qrCodeUrl) {
  const container = document.getElementById('printContainer');
  
  const { totalMonthly, breakdown } = calculateTotal(activeServices, pricesData, regionsData);
  const vatMultiplier = vatEnabled ? 1.2 : 1;
  const finalMonthly = totalMonthly * vatMultiplier;
  const finalYearly = finalMonthly * 12;

  let servicesHTML = '';
  activeServices.forEach(svc => {
    const item = breakdown.find(b => b.id === svc.uid);
    const regionName = regionsData.regions.find(r => r.id === svc.region)?.name || svc.region;
    
    let inputsStr = Object.entries(svc.inputs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');

    servicesHTML += `
      <div class="print-service">
        <div class="print-service-header">
          <span>${svc.name}</span>
          <span>${formatPrice(item.cost * vatMultiplier)}</span>
        </div>
        <div class="print-service-details">
          <span><strong>Region:</strong> ${regionName}</span>
          <span>${inputsStr}</span>
        </div>
      </div>
    `;
  });

  let breakdownHTML = '';
  breakdown.forEach(item => {
    breakdownHTML += `
      <div class="print-summary-row">
        <span>${item.name}</span>
        <span>${formatPrice(item.cost * vatMultiplier)}</span>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="print-header">
      <div class="print-header-left">
        <div class="print-logo">
          <svg width="24" height="24" viewBox="0 0 32 32">
            <path d="M4 20 L16 6 L28 20 L22 20 L16 13 L10 20 Z" fill="#000"/>
            <circle cx="16" cy="26" r="2" fill="#000"/>
          </svg>
          Velo<span>.AWS</span>
        </div>
        <div class="print-url">velo.aws.velosights.com</div>
        <div class="print-disclaimer">Estimates only — verify with the official AWS Pricing Calculator.</div>
      </div>
      <div class="print-qr">
        <img src="${qrCodeUrl}" alt="Scan to view estimate" style="width: 150px; height: 150px; display: block; image-rendering: pixelated;">
      </div>
    </div>

    <div class="print-layout">
      <div class="print-col-left">
        <h2 class="print-col-title">AWS Cost Estimator</h2>
        ${servicesHTML || '<p>No services selected.</p>'}
      </div>
      
      <div class="print-col-right">
        <h2 class="print-col-title">Estimate</h2>
        ${breakdownHTML}
        
        <div class="print-totals">
          <div class="print-summary-row" style="font-weight:bold; font-size: 16px;">
            <span>Monthly Total</span>
            <span class="print-total-big">${formatPrice(finalMonthly)}</span>
          </div>
          <div class="print-summary-row">
            <span>Yearly Total</span>
            <span>${formatPrice(finalYearly)}</span>
          </div>
          <div class="print-summary-row" style="font-size:12px; margin-top:8px;">
            <span>VAT (20%)</span>
            <span>${vatEnabled ? 'Included' : 'Not included'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}