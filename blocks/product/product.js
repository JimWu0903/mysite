// production.js
export default async function decorateBlock(block) {
    // 取得當前頁面的 meta data 中的 locale
    const metaLocale = document.querySelector('meta[name="locale"]');
    const locale = metaLocale ? metaLocale.content : 'default';
  
    // 構造 placeholders.json 的 URL
    const placeholdersUrl = `/${locale}/placeholders.json`;
    console.log("placeholder url: ", placeholdersUrl);

    try {
      // 獲取 placeholders.json
      const response = await fetch(placeholdersUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch placeholders.json: ${response.status}`);
      }
  
      const placeholdersData = await response.json();
      const placeholders = {};
  
      // 將 JSON 解析為 Key: Text 的映射
      placeholdersData.data.forEach((item) => {
        if (item.Key && item.Text) {
          placeholders[item.Key] = item.Text;
        }
      });
  
      // 替換內容區塊
  
      // 替換第一個 <section> 內唯一的 <p>
      const firstSectionP = block.querySelector('section div p');
      if (firstSectionP && placeholders.feature) {
        firstSectionP.textContent = placeholders.feature;
      }
  
      // 替換 class="info" div 下 last-child div 的內容
      const infoLastDiv = block.querySelector('.info > div:last-child');
      if (infoLastDiv && placeholders.info) {
        infoLastDiv.textContent = placeholders.info;
      }
  
      // 替換 class="info" div 下 last-child div 的 last-child div 的內容
      const infoNestedLastDiv = block.querySelector('.info > div:last-child > div:last-child');
      if (infoNestedLastDiv && placeholders.application) {
        infoNestedLastDiv.textContent = placeholders.application;
      }
  
      // 替換 class="spec" div 下 last-child div 的內容
      const specLastDiv = block.querySelector('.spec > div:last-child');
      if (specLastDiv && placeholders.keyFeature) {
        specLastDiv.textContent = placeholders.keyFeature;
      }
  
      // 替換展開與收合按鈕的文字
      const moreBtn = block.querySelector('#btnShowMoreDesc');
      const lessBtn = block.querySelector('#btnShowLessDesc');
  
      if (moreBtn && placeholders.more) {
        moreBtn.innerHTML = `${placeholders.more}<i class="fa fa-angle-down pl-1"></i>`;
      }
      if (lessBtn && placeholders.less) {
        lessBtn.innerHTML = `${placeholders.less}<i class="fa fa-angle-up pl-1"></i>`;
      }
  
      // 添加展開與收合按鈕的邏輯
      function decorateProductBlock(block) {
        const contentDiv = block.querySelector('.product.block > div > div:last-child') || 
                          block.querySelector('div > div:last-child');
        
        // 添加展開按鈕
        const moreBtn = document.createElement('button');
        moreBtn.className = 'cus-btn btn-sm my-1 btn-primary';
        moreBtn.id = 'btnShowMoreDesc';
        moreBtn.innerHTML = placeholders.more ? `${placeholders.more}<i class="fa fa-angle-down pl-1"></i>` : '更多<i class="fa fa-angle-down pl-1"></i>';
        
        // 添加收合按鈕
        const lessBtn = document.createElement('button');
        lessBtn.className = 'cus-btn btn-sm my-1 btn-primary';
        lessBtn.id = 'btnShowLessDesc';
        lessBtn.innerHTML = placeholders.less ? `${placeholders.less}<i class="fa fa-angle-up pl-1"></i>` : '收合<i class="fa fa-angle-up pl-1"></i>';
        
        // 直接將按鈕添加到 contentDiv
        contentDiv.appendChild(moreBtn);
        contentDiv.appendChild(lessBtn);
        
        // 添加 MutationObserver 來監控內容變化
        const observer = new MutationObserver(() => {
            const clone = contentDiv.cloneNode(true);
            clone.style.maxHeight = 'none';
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.width = contentDiv.offsetWidth + 'px';
            document.body.appendChild(clone);
  
            clone.querySelectorAll('button').forEach((button) => button.remove());
            const actualHeight = clone.offsetHeight;
            document.body.removeChild(clone);
  
            moreBtn.style.display = actualHeight > 300 ? 'block' : 'none';
        });
  
        observer.observe(contentDiv, {
            childList: true,
            subtree: true,
            characterData: true,
        });
  
        function toggleDescription() {
            if (!contentDiv.classList.contains('expanded')) {
                contentDiv.classList.add('expanded');
                moreBtn.style.display = 'none';
                lessBtn.style.display = 'block';
            } else {
                contentDiv.classList.remove('expanded');
                moreBtn.style.display = 'block';
                lessBtn.style.display = 'none';
            }
        }
  
        moreBtn.addEventListener('click', toggleDescription);
        lessBtn.addEventListener('click', toggleDescription);
  
        setTimeout(() => {
            const clone = contentDiv.cloneNode(true);
            clone.style.maxHeight = 'none';
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.width = contentDiv.offsetWidth + 'px';
            document.body.appendChild(clone);
  
            clone.querySelectorAll('button').forEach((button) => button.remove());
            const actualHeight = clone.offsetHeight;
            document.body.removeChild(clone);
  
            moreBtn.style.display = actualHeight > 250 ? 'block' : 'none';
        }, 500);
      }
  
      decorateProductBlock(block);
  
      // 添加需要的 FontAwesome
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
      }
  
    } catch (error) {
      console.error('Error replacing blocks:', error);
    }
  }
  