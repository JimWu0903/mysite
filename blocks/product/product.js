export default function decorateBlock(block) {
    function decorateProductBlock(block) {
        const contentDiv = block.querySelector('.product.block > div > div:last-child') || 
                          block.querySelector('div > div:last-child');
        
        // 添加展開按鈕
        const moreBtn = document.createElement('button');
        moreBtn.className = 'cus-btn btn-sm my-1 btn-primary';
        moreBtn.id = 'btnShowMoreDesc';
        moreBtn.innerHTML = '更多<i class="fa fa-angle-down pl-1"></i>';
        
        // 添加收合按鈕
        const lessBtn = document.createElement('button');
        lessBtn.className = 'cus-btn btn-sm my-1 btn-primary';
        lessBtn.id = 'btnShowLessDesc';
        lessBtn.innerHTML = '收合<i class="fa fa-angle-up pl-1"></i>';
        
        // 直接將按鈕添加到 contentDiv
        contentDiv.appendChild(moreBtn);
        contentDiv.appendChild(lessBtn);
        
        // 添加 MutationObserver 來監控內容變化
        const observer = new MutationObserver((mutations) => {
            // 計算實際內容高度
            const clone = contentDiv.cloneNode(true);
            clone.style.maxHeight = 'none';
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.width = contentDiv.offsetWidth + 'px'; // 設置相同寬度以確保準確計算
            document.body.appendChild(clone);
            
            // 移除克隆元素中的按鈕再計算高度
            const cloneButtons = clone.querySelectorAll('button');
            cloneButtons.forEach(button => button.remove());
            
            const actualHeight = clone.offsetHeight;
            document.body.removeChild(clone);
            
            console.log("Actual content height:", actualHeight);
            
            // 如果實際內容高度超過 300px，顯示更多按鈕
            if (actualHeight > 300) {
                moreBtn.style.display = 'block';
            } else {
                moreBtn.style.display = 'none';
            }
        });

        // 開始監控內容變化
        observer.observe(contentDiv, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 添加按鈕的點擊事件
        function toggleDescription() {
            if (!contentDiv.classList.contains('expanded')) {
                // 展開
                contentDiv.classList.add('expanded');
                moreBtn.style.display = 'none';
                lessBtn.style.display = 'block';
            } else {
                // 收合
                contentDiv.classList.remove('expanded');
                moreBtn.style.display = 'block';
                lessBtn.style.display = 'none';
            }
        }

        // 為按鈕添加事件監聽器
        moreBtn.addEventListener('click', toggleDescription);
        lessBtn.addEventListener('click', toggleDescription);
        
        // 初始檢查
        setTimeout(() => {
            const clone = contentDiv.cloneNode(true);
            clone.style.maxHeight = 'none';
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.width = contentDiv.offsetWidth + 'px';
            document.body.appendChild(clone);
            
            // 移除克隆元素中的按鈕再計算高度
            const cloneButtons = clone.querySelectorAll('button');
            cloneButtons.forEach(button => button.remove());
            
            const actualHeight = clone.offsetHeight;
            console.log("Initial content height:", actualHeight);
            document.body.removeChild(clone);
            
            if (actualHeight > 250) {
                moreBtn.style.display = 'block';
            } else {
                moreBtn.style.display = 'none';
            }
        }, 500);
    }
    
    // 調用函數進行裝飾
    decorateProductBlock(block);
    
    // 添加需要的 FontAwesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
    }
}