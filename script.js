document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const instructionEl = document.getElementById('instruction');
    
    // 質數和它們對應的 CSS 類名
    const primeColors = {
        2: { primeClass: 'prime-2', multipleClass: 'multiple-2', next: 3, name: '2 (藍色)' },
        3: { primeClass: 'prime-3', multipleClass: 'multiple-3', next: 5, name: '3 (紅色)' },
        5: { primeClass: 'prime-5', multipleClass: 'multiple-5', next: 7, name: '5 (綠色)' },
        7: { primeClass: 'prime-7', multipleClass: 'multiple-7', next: null, name: '7 (紫色)' }
    };
    
    let currentPrime = 2; // 從 2 開始

    // 1. 生成網格
    for (let i = 1; i <= 100; i++) {
        const item = document.createElement('div');
        item.classList.add('grid-item');
        item.textContent = i;
        item.dataset.number = i; // 將數字存儲在 data 屬性中
        
        if (i === 1) {
            item.classList.add('special-one', 'removed');
        } else {
            item.addEventListener('click', handleItemClick);
        }

        gridContainer.appendChild(item);
    }

    // 2. 處理點擊事件
    function handleItemClick(event) {
        const item = event.target;
        const number = parseInt(item.dataset.number);
        
        // 檢查是否是當前要篩選的質數
        if (number !== currentPrime) {
            if (item.classList.contains('removed')) {
                // 如果已經是合數，給予提示
                instructionEl.textContent = `${number} 已經被篩除，請點擊下一個質數 (${currentPrime}的深色格子)。`;
            } else {
                // 學生點錯了
                instructionEl.textContent = `請先點擊並篩除 ${currentPrime} 的倍數。`;
            }
            return;
        }

        // 執行篩選
        sieve(number, primeColors[number]);
        
        // 更新到下一個質數
        const nextPrime = primeColors[number].next;
        if (nextPrime) {
            currentPrime = nextPrime;
            instructionEl.textContent = `很好！現在請點擊下一個**未被標記**的數字：**${currentPrime}**，以繼續篩選。`;
        } else {
            instructionEl.textContent = `🎉 篩選完成！所有標記為**深色**或**未被標記**的數字（除了 1）都是 1-100 的質數！`;
            currentPrime = null; // 結束篩選
        }
    }

    // 3. 執行篩法邏輯
    function sieve(prime, colors) {
        const items = document.querySelectorAll('.grid-item');
        
        // 1. 標記質數本身 (深色)
        const primeItem = document.querySelector(`[data-number="${prime}"]`);
        primeItem.classList.add(colors.primeClass, 'removed');
        
        // 2. 標記質數的倍數 (淺色)
        for (let i = prime * 2; i <= 100; i += prime) {
            const multipleItem = document.querySelector(`[data-number="${i}"]`);
            
            // 只有當這個數字還沒有被標記為合數時，才添加新的淺色標記
            if (!multipleItem.classList.contains('removed')) {
                multipleItem.classList.add(colors.multipleClass, 'removed');
            }
            
            // 由於 100 以內只需要篩選到 7，之後的未標記數都是質數，我們將它們標記為 'removed' 防止點擊
            multipleItem.classList.add('removed');
        }
    }
});