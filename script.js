// Инициализация данных пользователя
let userData = JSON.parse(localStorage.getItem('userData')) || {
    crops: {
        wheat: { amount: 0, producing: false, endTime: 0 }, // Пшеница
        potato: { amount: 0, producing: false, endTime: 0 }, // Картофель
        carrot: { amount: 0, producing: false, endTime: 0 } // Морковь
    },
    animals: {
        chicken: { amount: 0, requiredCrop: 'wheat' }, // Курица требует пшеницу
        sheep: { amount: 0, requiredCrop: 'potato' }, // Овца требует картофель
        cow: { amount: 0, requiredCrop: 'carrot' } // Корова требует морковь
    }
};

// Сохранение данных в localStorage
function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Обновление вкладки "Ферма"
function updateFarmTab() {
    updateCropsTab();
    updateAnimalsTab();
}

// Обновление таба "Культуры"
function updateCropsTab() {
    const cropsList = document.getElementById('crops-list');
    cropsList.innerHTML = '';
    const crops = [
        { id: 'wheat', name: 'Пшеница' },
        { id: 'potato', name: 'Картофель' },
        { id: 'carrot', name: 'Морковь' }
    ];
    crops.forEach(crop => {
        const data = userData.crops[crop.id];
        const status = data.producing
            ? `Осталось: ${Math.ceil((data.endTime - Date.now()) / 1000)} сек`
            : '';
        const button = data.producing
            ? ''
            : `<button onclick="produceCrop('${crop.id}')">Произвести</button>`;
        const cropBlock = document.createElement('div');
        cropBlock.className = 'crop-block';
        cropBlock.innerHTML = `<p>${crop.name}: ${data.amount}</p><p>${status}</p>${button}`;
        cropsList.appendChild(cropBlock);
    });
}

// Обновление таба "Животные"
function updateAnimalsTab() {
    const animalsList = document.getElementById('animals-list');
    animalsList.innerHTML = '';
    const animals = [
        { id: 'chicken', name: 'Курица' },
        { id: 'sheep', name: 'Овца' },
        { id: 'cow', name: 'Корова' }
    ];
    animals.forEach(animal => {
        const data = userData.animals[animal.id];
        const requiredCrop = data.requiredCrop;
        const canProduce = userData.crops[requiredCrop].amount > 0;
        const button = canProduce
            ? `<button onclick="produceAnimal('${animal.id}')">Произвести</button>`
            : `Требуется: ${requiredCrop}`;
        const animalBlock = document.createElement('div');
        animalBlock.className = 'animal-block';
        animalBlock.innerHTML = `<p>${animal.name}: ${data.amount}</p>${button}`;
        animalsList.appendChild(animalBlock);
    });
}

// Производство культур
function produceCrop(crop) {
    if (userData.crops[crop].producing) {
        alert(`Производство ${crop} уже идет!`);
        return;
    }
    const productionTime = 60 * 1000; // 1 минута для примера
    userData.crops[crop].producing = true;
    userData.crops[crop].endTime = Date.now() + productionTime;
    saveUserData();
    updateFarmTab();
    setTimeout(() => {
        userData.crops[crop].amount += 1;
        userData.crops[crop].producing = false;
        saveUserData();
        updateFarmTab();
    }, productionTime);
}

// Производство животных
function produceAnimal(animal) {
    const requiredCrop = userData.animals[animal].requiredCrop;
    if (userData.crops[requiredCrop].amount <= 0) {
        alert(`Недостаточно ${requiredCrop} для производства ${animal}!`);
        return;
    }
    userData.crops[requiredCrop].amount -= 1;
    userData.animals[animal].amount += 1;
    saveUserData();
    updateFarmTab();
}

// Переключение табов
document.querySelectorAll('.tabs button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.style.display = panel.id === tab ? 'block' : 'none';
        });
        updateFarmTab();
    });
});

// Обновление интерфейса каждую секунду для таймеров
setInterval(updateFarmTab, 1000);

// Инициализация при загрузке
updateFarmTab();