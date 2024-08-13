(function() {
    var style = document.createElement('style');
    style.innerHTML = `
        .hidden {
            display: none !important;
        }
    `;
    document.body.appendChild(style);
    
    function checkAndHide() {
        var c = document.querySelectorAll('.card-body>.w-100');
        c.forEach(e => {
            var check = e.children[1];
            if (check.textContent === 'Estágio Supervisionado I' ||
                check.textContent === 'Trabalho de Conclusão de Curso I'
            ) {
                var child_1 = e.children[0];
                var child_1_1 = child_1.children[0];
                child_1_1.textContent = 'Aprovado';
                child_1_1.style.backgroundColor = '#008566';
                var nota1 = e.children[2];
                var nota2 = nota1.children[2];
                var nota3 = nota2.children[1];
                var nota4 = nota3.children[0];
                nota4.textContent = '10,0';
            }
            if (check.textContent === 'Trabalho de Conclusão de Curso II' ||
                check.textContent === 'Projeto de Extensão IV - Direito'
            ) {
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
        });

        var f = document.querySelectorAll('.fw-bold');
        f.forEach(e => {
            if (e.textContent === 'Filtros:') {
                e.parentNode.classList.add('hidden');
            }
        });
    }
    setInterval(checkAndHide, 500);
    checkAndHide();    
})();