const failed = [];
const stat = document.getElementById('weby_status');

function probe(url, i) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);
    fetch(`https://${url}`, {
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal,
    }).then(() => {
      stat.innerHTML += `<span class="result allowed">${url}</p>`;
      resolve();
    }).catch(() => {
      stat.innerHTML += `<span class="result banned">NEDOSTUPNÉ: ${url}</p>`;
      failed.push(i);
      resolve();
    });
  });
}

const prom = [];

fetch('./urls.json')
  .then((response) => response.json())
  .then((d) => {
    d.forEach((url, i) => {
      prom.push(probe(url, i));
    });
    Promise.allSettled(prom).then(() => console.log(failed));
  });
