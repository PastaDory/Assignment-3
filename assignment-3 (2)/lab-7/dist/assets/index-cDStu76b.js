(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function u(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(e){if(e.ep)return;e.ep=!0;const r=u(e);fetch(e.href,r)}})();async function E(n){try{const o=await fetch("https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/albums");if(!o.ok)throw new Error("Failed to fetch search results");return(await o.json()).filter(e=>e.artistName.toLowerCase().includes(n.toLowerCase())||e.albumName.toLowerCase().includes(n.toLowerCase()))}catch(o){return console.error("Error searching albums:",o.message),[]}}let d=[];function I(n){d.push(n)}function A(n){d=d.filter(o=>o.uid!==n.uid)}document.addEventListener("DOMContentLoaded",function(){const n=document.getElementById("search-button"),o=document.getElementById("favorites-button"),u=document.getElementById("search-tab"),c=document.getElementById("favorites-tab"),e=document.getElementById("search-form"),r=document.getElementById("search-results");n.addEventListener("click",function(){n.classList.add("active"),o.classList.remove("active"),u.classList.remove("d-none"),c.classList.add("d-none")}),o.addEventListener("click",function(){o.classList.add("active"),n.classList.remove("active"),c.classList.remove("d-none"),u.classList.add("d-none"),i()}),e.addEventListener("submit",async function(t){t.preventDefault();const s=document.getElementById("query").value.trim(),a=await E(s);r.innerHTML="",a.forEach(p=>{const l=b(p,!0);r.appendChild(l),l.querySelector(".add-to-favorites").addEventListener("click",function(){const f=this.getAttribute("data-uid"),v=a.find(L=>L.uid===f);h(v)||(I(v),y(v),i())})})});function i(){const t=document.getElementById("my-albums");t.innerHTML="",d.forEach(s=>{const a=b(s,!1);t.appendChild(a),a.querySelector(".remove-from-favorites").addEventListener("click",function(){const l=this.getAttribute("data-uid"),m=d.find(f=>f.uid===l);A(m),g(m),i()})})}function h(t){return d.some(s=>s.uid===t.uid)}async function y(t){try{if(!(await fetch("https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/favorites",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).ok)throw new Error("Failed to add album to favorites API")}catch(s){console.error("Error adding album to favorites API:",s.message)}}async function g(t){try{if(!(await fetch(`https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/favorites/${t.uid}`,{method:"DELETE"})).ok)throw new Error("Failed to remove album from favorites API")}catch(s){console.error("Error removing album from favorites API:",s.message)}}function b(t,s){const a=document.createElement("li");return a.classList.add("list-group-item","d-flex","justify-content-between","align-items-start"),a.innerHTML=`
            <div class="ms-2 me-auto">
                <div class="fw-bold">${t.albumName} <span class="badge bg-primary rounded-pill">${t.averageRating}</span></div>
                <span>${t.artistName}</span>
            </div>
            <button data-uid="${t.uid}" type="button" class="btn ${s?"btn-success add-to-favorites":"btn-danger remove-from-favorites"}">${s?"Add to Favorites":"Remove from Favorites"}</button>
        `,a}});