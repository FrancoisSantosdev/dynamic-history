// Captura a URL e o nome do site ao clicar na extensão
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        const url = tab.url;
        const title = tab.title;

        // Atualiza o conteúdo da extensão com a URL e o nome do site
        const siteUrlElement = document.getElementById('site-url');
        siteUrlElement.textContent = url;

        const siteTitleElement = document.getElementById('site-title');
        siteTitleElement.textContent = title;
    });
});

// Redireciona o usuário para o site ao clicar no link
document.addEventListener('click', function(event) {
    if (event.target.matches('.site-link')) {
        const url = event.target.dataset.url;
        chrome.tabs.create({ url: url });
    }
});



// Accessing browsing history and categorizing sites
chrome.history.search({ text: '', maxResults: 100 }, function (data) {
    const categories = [
        { name: 'Esporte', sites: [], subcategories: [] },
        { name: 'Saúde', sites: [], subcategories: [] },
        { name: 'Trabalho', sites: [], subcategories: [] },
        { name: 'Tecnologia', sites: [], subcategories: [] },
        { name: 'Religião', sites: [], subcategories: [] }
    ];

    data.forEach(function (page) {
        let site = { name: page.title, url: page.url };

        if (containsKeyword(page.url, 'esporte')) {
            addToCategory('Esporte', site);
        } else if (containsKeyword(page.url, 'saude')) {
            addToCategory('Saúde', site);
        } else if (containsKeyword(page.url, 'trabalho')) {
            addToCategory('Trabalho', site);
        } else if (containsKeyword(page.url, 'tecnologia')) {
            addToCategory('Tecnologia', site);
        } else if (containsKeyword(page.url, 'religiao')) {
            addToCategory('Religião', site);
        }
    });

    function containsKeyword(url, keyword) {
        return url.toLowerCase().includes(keyword);
    }

    function addToCategory(categoryName, site) {
        let category = categories.find(cat => cat.name === categoryName);
        if (category) {
            if (category.sites.length < 3) {
                category.sites.push(site);
            } else {
                let subcategoryName = findSubcategoryName(site.url);
                let subcategory = category.subcategories.find(sub => sub.name === subcategoryName);
                if (!subcategory) {
                    subcategory = { name: subcategoryName, sites: [] };
                    category.subcategories.push(subcategory);
                }
                subcategory.sites.push(site);
            }
        }
    }

    function findSubcategoryName(url) {
        // Implemente a lógica para determinar o nome da subcategoria com base no URL
        // Você pode usar expressões regulares ou outras técnicas para isso
        // Este é apenas um exemplo simples
        if (url.includes('esporte')) {
            return 'Subcategoria Esporte';
        } else if (url.includes('saude')) {
            return 'Subcategoria Saúde';
        } else if (url.includes('trabalho')) {
            return 'Subcategoria Trabalho';
        } else if (url.includes('tecnologia')) {
            return 'Subcategoria Tecnologia';
        } else if (url.includes('religiao')) {
            return 'Subcategoria Religião';
        } else {
            return 'Outros';
        }
    }

    // Renderizando as categorias e subcategorias na barra lateral
    const categoriesList = document.getElementById('categories-list');
    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.textContent = category.name;

        const subcategoriesList = document.createElement('ul');
        category.subcategories.forEach(subcategory => {
            const subcategoryItem = document.createElement('li');
            subcategoryItem.textContent = subcategory.name;

            const sitesList = document.createElement('ul');
            subcategory.sites.forEach(site => {
                const siteItem = document.createElement('li');
                const siteLink = document.createElement('a');
                siteLink.textContent = site.name;
                siteLink.href = site.url;
                siteLink.classList.add('site-link');
                siteLink.setAttribute('target', '_blank');
                siteItem.appendChild(siteLink);
                sitesList.appendChild(siteItem);
            });

            subcategoryItem.appendChild(sitesList);
            subcategoriesList.appendChild(subcategoryItem);
        });

        categoryItem.appendChild(subcategoriesList);
        categoriesList.appendChild(categoryItem);
    });
});
