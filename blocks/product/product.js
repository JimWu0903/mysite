// production.js
export default async function decorateBlock(block) {
    // 取得當前頁面的 meta data 中的 locale
    const metaLocale = document.querySelector('meta[name="locale"]');
    const locale = metaLocale ? metaLocale.content : 'default';

    // 取得當前頁面的相對路徑並去除最後的資源名稱
    const currentPath = window.location.pathname.replace(/\/[^/]*$/, '/');
    console.log("current path: ", currentPath);

    // 構造 placeholders.json 的 URL
    const placeholdersUrl = `${currentPath}placeholders.json`;
    console.log("placeholder url: ", placeholdersUrl);

    try {
        // 獲取 placeholders.json
        console.log("Fetching placeholders.json from: ", placeholdersUrl);
        const response = await fetch(placeholdersUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch placeholders.json: ${response.status}`);
        }

        const placeholdersData = await response.json();
        console.log("Fetched placeholders data: ", placeholdersData);

        const placeholders = {};

        // 將 JSON 解析為 Key: Text 的映射
        placeholdersData.data.forEach((item) => {
            if (item.Key && item.Text) {
                placeholders[item.Key] = item.Text;
            }
        });
        console.log("Parsed placeholders: ", placeholders);

        // 替換內容區塊

        // 替換第一個 <section> 內唯一的 <p>
        const firstSectionP = block.querySelector('section div p');
        console.log("First section <p>: ", firstSectionP);
        if (firstSectionP && placeholders.feature) {
            console.log("Replacing content of first <p> with: ", placeholders.feature);
            firstSectionP.textContent = placeholders.feature;
        }

        // 替換 class="info" div 下 last-child div 的內容
        const infoLastDiv = block.querySelector('.info > div:last-child');
        console.log("Last child in .info: ", infoLastDiv);
        if (infoLastDiv && placeholders.info) {
            console.log("Replacing content of .info last-child with: ", placeholders.info);
            infoLastDiv.textContent = placeholders.info;
        }

        // 替換 class="info" div 下 last-child div 的 last-child div 的內容
        const infoNestedLastDiv = block.querySelector('.info > div:last-child > div:last-child');
        console.log("Nested last child in .info: ", infoNestedLastDiv);
        if (infoNestedLastDiv && placeholders.application) {
            console.log("Replacing content of .info nested last-child with: ", placeholders.application);
            infoNestedLastDiv.textContent = placeholders.application;
        }

        // 替換 class="spec" div 下 last-child div 的內容
        const specLastDiv = block.querySelector('.spec > div:last-child');
        console.log("Last child in .spec: ", specLastDiv);
        if (specLastDiv && placeholders.keyFeature) {
            console.log("Replacing content of .spec last-child with: ", placeholders.keyFeature);
            specLastDiv.textContent = placeholders.keyFeature;
        }

        // 替換展開與收合按鈕的文字
        const moreBtn = block.querySelector('#btnShowMoreDesc');
        const lessBtn = block.querySelector('#btnShowLessDesc');

        console.log("More button: ", moreBtn);
        console.log("Less button: ", lessBtn);

        if (moreBtn && placeholders.more) {
            console.log("Replacing content of More button with: ", placeholders.more);
            moreBtn.innerHTML = `${placeholders.more}<i class="fa fa-angle-down pl-1"></i>`;
        }
        if (lessBtn && placeholders.less) {
            console.log("Replacing content of Less button with: ", placeholders.less);
            lessBtn.innerHTML = `${placeholders.less}<i class="fa fa-angle-up pl-1"></i>`;
        }

        // 添加展開與收合按鈕的邏輯
        function decorateProductBlock(block) {
            const contentDiv = block.querySelector('.product.block > div > div:last-child') ||
                block.querySelector('div > div:last-child');
            console.log("Content div for product block: ", contentDiv);

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

                console.log("Actual height of content div: ", actualHeight);
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

                console.log("Initial height of content div: ", actualHeight);
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
