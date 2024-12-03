// async function decorateSpecBlock(block) {
//     // 找到 JSON URL 的容器
//     const urlElement = block.querySelector('.button-container a');
//     const specUrl = urlElement.href; // 獲取 JSON URL
  
//     // 找到右側特性列表的容器
//     const featureContainer = block.querySelector('div > div:nth-child(2)');
  
//     // 加載 JSON 數據
//     try {
//       const response = await fetch(specUrl);
//       if (!response.ok) {
//         throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
//       }
  
//       const specData = await response.json();
  
//       // 如果數據為空或不是正確結構
//       if (!specData.data || specData.data.length === 0) {
//         throw new Error('JSON 數據為空或結構不正確');
//       }
  
//       // 清空 URL 容器
//       const tableContainer = document.createElement('div');
//       tableContainer.className = 'spec-table-column';
//       urlElement.parentElement.replaceWith(tableContainer);
  
//       // 創建表格
//       const table = document.createElement('table');
//       const thead = document.createElement('thead');
//       const tbody = document.createElement('tbody');
  
//       // 添加表頭
//       const headerRow = document.createElement('tr');
//       ['Status', 'Active'].forEach((header) => {
//         const th = document.createElement('th');
//         th.textContent = header;
//         headerRow.appendChild(th);
//       });
//       thead.appendChild(headerRow);
//       table.appendChild(thead);
  
//       // 添加表格數據
//       specData.data.forEach((row) => {
//         const tr = document.createElement('tr');
//         ['Status', 'Active'].forEach((key) => {
//           const td = document.createElement('td');
//           td.textContent = row[key] || ''; // 如果值為空則顯示空字串
//           tr.appendChild(td);
//         });
//         tbody.appendChild(tr);
//       });
//       table.appendChild(tbody);
//       tableContainer.appendChild(table);
  
//       // 確保右側列表保持完整
//       if (!featureContainer.querySelector('h2')) {
//         const featureTitle = document.createElement('h2');
//         featureTitle.textContent = '關鍵特性';
//         featureContainer.prepend(featureTitle);
//       }
//     } catch (error) {
//       console.error('無法加載 JSON 數據:', error);
  
//       // 在 URL 容器中顯示錯誤
//       const errorMessage = document.createElement('p');
//       errorMessage.textContent = '無法加載表格內容，請檢查 JSON 文件或網絡連接。';
//       urlElement.parentElement.replaceWith(errorMessage);
//     }
//   }
  
//   // 裝飾 spec block
//   decorateSpecBlock(document.querySelector('.spec.block'));
  