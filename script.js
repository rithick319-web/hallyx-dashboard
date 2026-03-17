const API="/orders"
let editId=null

/* ---------------- ORDERS ---------------- */

async function loadOrders(){

const table=document.getElementById("orders")
if(!table) return

const res=await fetch(API)
const data=await res.json()

table.innerHTML=""

data.forEach(o=>{

table.innerHTML+=`
<tr>
<td>${o.id}</td>
<td>${o.first} ${o.last}</td>
<td>${o.phone}</td>
<td>${o.email}</td>
<td>${o.qty}</td>
<td>${o.price}</td>
<td>${o.status}</td>
<td>
<button onclick="editOrder(${o.id})">Edit</button>
<button onclick="deleteOrder(${o.id})">Delete</button>
</td>
</tr>
`

})

}

function openForm(){

editId=null

document.getElementById("first").value=""
document.getElementById("last").value=""
document.getElementById("phone").value=""
document.getElementById("email").value=""
document.getElementById("qty").value=""
document.getElementById("price").value=""

document.getElementById("formModal").style.display="block"

}

async function saveOrder(){

const order={
first:document.getElementById("first").value,
last:document.getElementById("last").value,
phone:document.getElementById("phone").value,
email:document.getElementById("email").value,
qty:document.getElementById("qty").value,
price:document.getElementById("price").value,
status:document.getElementById("status").value
}

if(editId){
await fetch(API+"/"+editId,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(order)
})
}else{
await fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(order)
})
}

document.getElementById("formModal").style.display="none"
loadOrders()

}

async function editOrder(id){

const res=await fetch(API)
const data=await res.json()

const o=data.find(x=>x.id===id)

editId=id

document.getElementById("first").value=o.first
document.getElementById("last").value=o.last
document.getElementById("phone").value=o.phone
document.getElementById("email").value=o.email
document.getElementById("qty").value=o.qty
document.getElementById("price").value=o.price
document.getElementById("status").value=o.status

document.getElementById("formModal").style.display="block"

}

async function deleteOrder(id){
await fetch(API+"/"+id,{method:"DELETE"})
loadOrders()
}

/* ---------------- DASHBOARD ---------------- */

async function addChart(type){

const container=document.getElementById("widgets")
if(!container) return

const widget=document.createElement("div")
widget.className="widget"

/* HEADER */
const header=document.createElement("div")
header.style.display="flex"
header.style.justifyContent="space-between"
header.style.marginBottom="10px"

const title=document.createElement("span")
title.innerText=type.toUpperCase()

const del=document.createElement("button")
del.innerText="🗑️"
del.style.background="white"
del.style.cursor="pointer"

del.onclick=()=>widget.remove()

header.appendChild(title)
header.appendChild(del)

widget.appendChild(header)

/* TABLE FIX (DELETE WORKING) */
if(type==="table"){

const res=await fetch(API)
const data=await res.json()

const table=document.createElement("table")
table.style.width="100%"

data.forEach(o=>{
const row=document.createElement("tr")

row.innerHTML=`<td>${o.first}</td><td>${o.price}</td>`

table.appendChild(row)
})

widget.appendChild(table)
container.appendChild(widget)

return
}

/* CHART FIX (SIZE CONTROL) */
const canvas=document.createElement("canvas")

canvas.style.width="100%"
canvas.style.height="200px"

widget.appendChild(canvas)
container.appendChild(widget)

const res=await fetch(API)
const data=await res.json()

const labels=data.map(o=>o.first)
const values=data.map(o=>Number(o.price))

const colors=[
"#c0bfe9ff","#c0ece9ff","#121c58ff","#7a777aff","#c4b4caff","#86efac"
]

new Chart(canvas,{
type:type,
data:{
labels,
datasets:[{
data:values,
backgroundColor:colors,
borderColor:"#e2f0e7ff",
fill:true
}]
},
options:{
responsive:true,
maintainAspectRatio:false   // IMPORTANT FIX
}
})

}

/* DRAG */

const widgets=document.getElementById("widgets")

if(widgets){
new Sortable(widgets,{animation:150})
}

/* LOAD */

loadOrders()