let failed = [];
let count = 0;

function probe(url, i) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);
    fetch(`https://${url}`, {
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal,
    }).then(() => {
      webyStatus.innerHTML += `<span class="result allowed">${url}</span><br>`;
      resolve();
    }).catch(() => {
      webyStatus.innerHTML += `<span class="result banned">NEDOSTUPNÉ: ${url}</span><br>`;
      failed.push(i);
      infoDiv.innerHTML = `Nedostupné: <span class="banned">${failed.length}</span>/${count}`;
      resolve();
    });
  });
}

function dSend(jsn) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://kdsw1d1te1.execute-api.eu-central-1.amazonaws.com/prod', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(jsn));
}

function makeCheck() {
  failed = [];
  webyStatusShow.style.visibility = 'hidden';
  checkBtn.innerHTML = 'Kontroluji...';
  checkBtn.disabled = true;
  const prom = [];

  fetch('https://data.irozhlas.cz/weblok/urls.json')
    .then((response) => response.json())
    .then((d) => {
      count = d.length;
      infoDiv.innerHTML = `Nedostupné: 0/${count}`;
      d.forEach((url, i) => {
        prom.push(probe(url, i, count));
      });
      Promise.allSettled(prom).then(() => {
        dSend(failed);
        webyStatusShow.style.visibility = 'visible';
        setTimeout(() => {
          checkBtn.innerHTML = 'Zkontrolovat';
          checkBtn.disabled = false;
        }, 5000);
      });
    });
}

const mainDiv = document.getElementById('dezinfo_check');
const checkBtn = document.createElement('button');
checkBtn.setAttribute('id', 'check_button');
checkBtn.innerHTML = 'Zkontrolovat';
checkBtn.addEventListener('click', makeCheck);
mainDiv.appendChild(checkBtn);

const infoDiv = document.createElement('div');
infoDiv.setAttribute('id', 'info');
infoDiv.innerHTML = 'Prověřte si, které dezinformační weby nejsou na vašem připojení k internetu nedostupné. Anonymně sebraná data nám zároveň pomohou objasnit, které stránky blokují kteří poskytovatelé internetu.';
mainDiv.appendChild(infoDiv);

const webyStatus = document.createElement('div');
webyStatus.setAttribute('id', 'weby_status');
webyStatus.style.display = 'none';

const webyStatusShow = document.createElement('button');
webyStatusShow.setAttribute('id', 'weby_status_show');
webyStatusShow.innerHTML = 'Zobrazit weby';
webyStatusShow.style.visibility = 'hidden';
webyStatusShow.addEventListener('click', () => {
  if (webyStatus.style.display === 'none') {
    webyStatus.style.display = '';
    webyStatusShow.innerHTML = 'Skrýt weby';
  } else {
    webyStatus.style.display = 'none';
    webyStatusShow.innerHTML = 'Zobrazit weby';
  }
});
mainDiv.appendChild(webyStatusShow);
mainDiv.appendChild(webyStatus);

const webyCredits = document.createElement('div');
webyCredits.setAttribute('id', 'weby_credits');
webyCredits.innerHTML = 'Zdroj: Dezinformační weby podle <a target="_blank" href="http://www.atlaskonspiraci.cz">Atlasu konspirací</a> doplněné o <a target="_blank" href="https://www.root.cz/zpravicky/narodni-centrum-kybernetickych-operaci-vyzyva-poskytovatele-k-blokaci-dalsich-webu/">seznam Vojenského zpravodajství</a>.';
mainDiv.appendChild(webyCredits);
