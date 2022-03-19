const failed = [];
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
      webyStatus.innerHTML += `<span class="result allowed">${url}</p>`;
      resolve();
    }).catch(() => {
      webyStatus.innerHTML += `<span class="result banned">NEDOSTUPNÉ: ${url}</p>`;
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
  webyStatusShow.style.display = 'none';
  checkBtn.innerHTML = 'Kontroluji...';
  checkBtn.disabled = true;
  const prom = [];

  fetch('./urls.json')
    .then((response) => response.json())
    .then((d) => {
      count = d.length;
      infoDiv.innerHTML = `Nedostupné: 0/${count}`;
      d.forEach((url, i) => {
        prom.push(probe(url, i, count));
      });
      Promise.allSettled(prom).then(() => {
        dSend(failed);
        webyStatusShow.style.display = '';
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
infoDiv.innerHTML = '<p>Prověřte si, které dezifnormační weby jsou na vašem připojení k internetu nedostupné.</p>';
mainDiv.appendChild(infoDiv);

const webyStatus = document.createElement('div');
webyStatus.setAttribute('id', 'weby_status');
webyStatus.style.display = 'none';

const webyStatusShow = document.createElement('button');
webyStatusShow.setAttribute('id', 'weby_status_show');
webyStatusShow.innerHTML = 'Zobrazit weby';
webyStatusShow.style.display = 'none';
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
webyCredits.innerHTML = 'Zdroj: Seznam dezinformačních webů podle <a target="_blank" href="http://www.atlaskonspiraci.cz">Atlasu konspirací</a> doplněný o <a target="_blank" href="https://www.root.cz/zpravicky/narodni-centrum-kybernetickych-operaci-vyzyva-poskytovatele-k-blokaci-dalsich-webu/">seznam Vojenského zpravodajství</a>.';
mainDiv.appendChild(webyCredits);
