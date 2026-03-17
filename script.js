// Sample order data (matches index.html localStorage)
function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [
    { id: 1773720471192, first: 'json', last: 'smith', phone: '7891234560', email: 'jsonsmith@gmail.com', qty: 2, price: 800, status: 'Paid' },
    { id: 1773739185102, first: 'sam', last: 'v', phone: '8901234567', email: 'samualv@gmail.com', qty: 1, price: 400, status: 'Paid' },
    { id: 1773739263441, first: 'john', last: 's', phone: '9012345678', email: 'johnsnow@gmail.com', qty: 4, price: 1600, status: 'Paid' },
    { id: 1773739332463, first: 'wikki', last: 's', phone: '7654321890', email: 'wikkiofficial@gmail.com', qty: 3, price: 1200, status: 'Paid' },
    { id: 1773739416656, first: 'brandon', last: 'king', phone: '8765432109', email: 'branstark@gmail.com', qty: 2, price: 800, status: 'Paid' }
  ];
}

// KPI Calculations
function getKPIData() {
  const orders = getOrders();
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const totalQty = orders.reduce((sum, o) => sum + o.qty, 0);
  const paidOrders = orders.filter(o => o.status === 'Paid').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return [
    { title: 'Total Orders', value: totalOrders, change: '+2 this week', trend: 'up' },
    { title: 'Total Revenue', value: '₹' + totalRevenue, change: '+₹400 this week', trend: 'up' },
    { title: 'Total Qty Sold', value: totalQty, change: '+3 this week', trend: 'up' },
    { title: 'Paid Orders', value: paidOrders, change: paidOrders + ' of ' + totalOrders, trend: 'up' },
    { title: 'Pending Orders', value: pendingOrders, change: pendingOrders + ' pending', trend: pendingOrders > 0 ? 'down' : 'up' },
    { title: 'Avg Order Value', value: '₹' + avgOrderValue, change: 'Per order avg', trend: 'up' },
  ];
}

// Chart data
function getChartData() {
  const orders = getOrders();
  const labels = orders.map(o => o.first + ' ' + o.last);
  const prices = orders.map(o => o.price);
  const colors = ['#b8b8d4', '#a8d8d8', '#2d3a6b', '#8a8a9a', '#c4b8d4'];
  return { labels, prices, colors };
}

let widgetCount = 0;
let kpiIndex = 0;

function addChart(type) {
  const container = document.getElementById('widgets');
  const id = 'widget-' + widgetCount++;
  const div = document.createElement('div');
  div.className = 'widget' + (type === 'kpi' ? ' kpi-widget' : '');
  div.id = id;

  if (type === 'kpi') {
    const kpis = getKPIData();
    const kpi = kpis[kpiIndex % kpis.length];
    kpiIndex++;

    div.innerHTML = `
      <div class="widget-header" style="width:100%">
        <span class="widget-title">KPI</span>
        <button class="remove-btn" onclick="removeWidget('${id}')">🗑️</button>
      </div>
      <div class="kpi-title">${kpi.title}</div>
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-change ${kpi.trend}">${kpi.trend === 'up' ? '▲' : '▼'} ${kpi.change}</div>
    `;

  } else if (type === 'table') {
    const orders = getOrders();
    let rows = orders.map(o => `
      <tr>
        <td>${o.first} ${o.last}</td>
        <td>${o.qty}</td>
        <td>₹${o.price}</td>
        <td>${o.status}</td>
      </tr>
    `).join('');

    div.style.height = 'auto';
    div.innerHTML = `
      <div class="widget-header">
        <span class="widget-title">Orders Table</span>
        <button class="remove-btn" onclick="removeWidget('${id}')">🗑️</button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;font-family:'Segoe UI',sans-serif;">
        <thead style="background:#f5f5f5;">
          <tr>
            <th style="padding:6px;text-align:left;">Name</th>
            <th style="padding:6px;text-align:center;">Qty</th>
            <th style="padding:6px;text-align:center;">Price</th>
            <th style="padding:6px;text-align:center;">Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

  } else {
    const canvasId = 'canvas-' + id;
    div.innerHTML = `
      <div class="widget-header">
        <span class="widget-title">${type.charAt(0).toUpperCase() + type.slice(1)} Chart</span>
        <button class="remove-btn" onclick="removeWidget('${id}')">🗑️</button>
      </div>
      <canvas id="${canvasId}"></canvas>
    `;
    container.appendChild(div);

    const { labels, prices, colors } = getChartData();
    const ctx = document.getElementById(canvasId).getContext('2d');

    new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue (₹)',
          data: prices,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2,
          fill: type === 'line' ? false : true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: type === 'pie' }
        }
      }
    });
    return;
  }

  container.appendChild(div);
}

function removeWidget(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// Drag and drop reorder
Sortable.create(document.getElementById('widgets'), {
  animation: 150,
  ghostClass: 'sortable-ghost'
});