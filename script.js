document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const instructionEl = document.getElementById('instruction');
    
    // 質數和它們對應的 CSS 類名及流程控制
    const primeColors = {
        // next: null 表示這是篩法在 100 範圍內需要篩選的最後一個質數 (sqrt(100) = 10)
        2: { primeClass: 'prime-2', multipleClass: 'multiple-2', next: 3 },
        3: { primeClass: 'prime-3', multipleClass: 'multiple-3', next: 5 },
        5: { primeClass: 'prime-5', multipleClass: 'multiple-5', next: 7 },
        7: { primeClass: 'prime-7', multipleClass: 'multiple-7', next: null }
    };
    
    let currentPrime = 2; // 從 2 開始

    // 1. 生成網格
    function createGrid() {
        for (let i = 1; i <= 100; i++) {
            const item = document.createElement('div');
            item.classList.add('grid-item');
            item.textContent = i;
            item.dataset.number = i; // 將數字存儲在 data 屬性中
            
            if (i === 1) {
                // 1 既非質數也非合數，標記為特殊顏色並禁止點擊
                item.classList.add('special-one', 'removed');
            } else {
                item.addEventListener('click', handleItemClick);
            }

            gridContainer.appendChild(item);
        }
    }
    
    // 2. 處理點擊事件 (主要互動邏輯)
    function handleItemClick(event) {
        const item = event.target;
        const number = parseInt(item.dataset.number);
        
        // 如果流程已結束，點擊任何東西都不做
        if (currentPrime === null) {
            instructionEl.textContent = `🎉 篩選已完成！`;
            return;
        }

        // 檢查是否是當前要篩選的質數 (2, 3, 5, 或 7)
        if (number === currentPrime) {
            // 執行篩選
            sieve(number, primeColors[number]);
            
            // 更新到下一個質數
            const nextPrime = primeColors[number].next;
            if (nextPrime) {
                currentPrime = nextPrime;
                instructionEl.textContent = `很好！現在請點擊下一個**未被標記**的數字：**${currentPrime}**，繼續篩選。`;
            } else {
                // 點擊 7 之後，流程結束
                instructionEl.textContent = `🎉 篩選完成！所有標記為**深色**或**未被標記**的數字（除了 1）都是 1-100 的質數！`;
                currentPrime = null; // 結束篩選
            }
            return;
        }

        // 處理錯誤點擊
        if (item.classList.contains('removed')) {
            instructionEl.textContent = `${number} 已經被篩除，請點擊下一個質數 (${currentPrime}) 的深色格子。`;
        } else {
            instructionEl.textContent = `請先點擊並篩除 ${currentPrime} 的倍數。`;
        }
    }

    // 3. 執行篩法核心邏輯
    function sieve(prime, colors) {
        
        // A. 標記質數本身 (深色)
        const primeItem = document.querySelector(`[data-number="${prime}"]`);
        // 確保質數本身標記為深色，並設定為 'removed' 防止再次點擊
        primeItem.classList.add(colors.primeClass, 'removed');
        
        // B. 標記質數的倍數 (淺色)
        for (let i = prime * 2; i <= 100; i += prime) {
            const multipleItem = document.querySelector(`[data-number="${i}"]`);
            
            // 只有當這個數字還沒有被標記為合數時 (即沒有 .removed class)，才添加新的淺色標記。
            // 這樣可以保持第一次篩除的顏色，避免覆蓋。
            if (!multipleItem.classList.contains('removed')) {
                multipleItem.classList.add(colors.multipleClass);
            }
            
            // 將所有倍數（無論是否被覆蓋顏色）標記為 'removed'，使其不再能被點擊
            multipleItem.classList.add('removed');
        }
    }

    // 啟動網頁
    createGrid();
});