var colorMenu = [
    {
        color: '#cb6ce6',
    },
];

var iniciar = [
    {
        area: {   
            node: Camiseta.Costa,
            name: 'Frente',
            add: [
                {
                    tittle: 'Grade de fotos',
                    image: {
                        position: {
                            x: 624,
                            y: 626, 
                            width: 2260,
                            height: 2890,
                        },
                        upload: { 
                            type: 'svg',
                            attrs: {
                                noEdit: {
                                    jsColor: [
                                        { attrs: ['fill'], id: 1 },
                                    ],
                                },
                            },
                            add: [
                                {x: 0, y: 0, width: 1130, height: 1445},
                                {x: 1130, y: 0, width: 1130, height: 1445},
                                {x: 0, y: 1445, width: 1130, height: 1445},
                                {x: 1130, y: 1445, width: 1130, height: 1445},
                            ],
                        },
                        clip: {
                            url: 'mask.svg',
                        }, 
                    },
                }
            ]
        }
    } 
]