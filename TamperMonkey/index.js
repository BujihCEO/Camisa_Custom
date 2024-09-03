(function() {
    var style = document.createElement('style');
    style.innerHTML = `
        .hidden {
            display: none !important;
        }
        .card_card__-mkmr[data-tipo=presencial]:nth-child(1) {
            display: none;
        }

    `;
    document.body.appendChild(style);
    
    function test() {
        var c = document.querySelectorAll('.card-body>.w-100');
        var list = [];
        c.forEach(e => {
            var check = e.children[1];
            if (check.textContent === 'Estágio Supervisionado I' ||
                check.textContent === 'Estágio Supervisionado II' ||
                check.textContent === 'Estágio Supervisionado III' ||
                check.textContent === 'Trabalho de Conclusão de Curso II'
            ) {
                list.push(e);
            }
        });
        list.forEach((e, i)=> {
            if (i === 0 && !e.getAttribute('changed')){
                e.setAttribute('changed', '');
                e.children[1].textContent = 'Estágio Supervisionado III';
            }
            if ((i === 1 || i === 2) && !e.getAttribute('changed')){
                e.setAttribute('changed', '');
                var child_1 = e.children[0];
                var child_1_1 = child_1.children[0];
                child_1_1.textContent = 'Aprovado';
                child_1_1.style.backgroundColor = '#008566';
                child_1_1.style.color = 'white';
                var nota1 = e.children[2];
                var nota2 = nota1.children[2];
                var nota3 = nota2.children[1];
                var nota4 = nota3.children[0];
                nota4.textContent = '10,0';
            }
            if (i === 3 && !e.getAttribute('changed')){
                e.setAttribute('changed', '');
                var child_1 = e.children[0];
                var child_1_1 = child_1.children[0];
                child_1_1.textContent = 'A cursar';
                child_1_1.style.backgroundColor = '#dee2e6';
                child_1_1.style.color = 'black';
                var nota1 = e.children[2];
                var nota2 = nota1.children[2];
                var nota3 = nota2.children[1];
                var nota4 = nota3.children[0];
                nota4.textContent = '-';
            }
            if (i === 4 && !e.getAttribute('changed')){
                e.setAttribute('changed', '');
                var child_1 = e.children[0];
                var child_1_1 = child_1.children[0];
                child_1_1.textContent = 'Cursando';
                child_1_1.style.backgroundColor = '#dee2e6';
                child_1_1.style.color = 'black';
                var nota1 = e.children[2];
                var nota2 = nota1.children[2];
                var nota3 = nota2.children[1];
                var nota4 = nota3.children[0];
                nota4.textContent = '-';
            }
        });
        var ava = document.querySelectorAll('.card-content-title');
        ava.forEach(e=> {
            if (e.textContent === 'Estágio Supervisionado I') {
                e.parentNode.parentNode.parentNode.classList.add('hidden');
            }
        });
        var h = document.querySelectorAll('.card_card__-mkmr');
        h.forEach(e => {
            console.log(e);
        });
        var filtroDiv = document.querySelector('div[ng-repeat="filtro in c.filtroAtuais"]');
        if (filtroDiv) {
            filtroDiv.parentNode.classList.add('hidden');
        }
    }
    setInterval(test, 500);
    test();
})();