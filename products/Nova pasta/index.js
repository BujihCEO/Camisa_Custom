var colorMenu = [
    {
        color: '#cb6ce6',
    },
];

var iniciar = [
    {
        node: Camiseta.Costa,
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
            },
            {
                image: {
                    position: {
                        x: 0,
                        y: 100, 
                        width: 3508,
                        height: 3942,
                    },
                    mask: {
                        url: 'img.svg',
                        attrs: {
                            jsColor: [
                                { attrs: ['fill'], id: 1 },
                            ],
                        },
                    }, 
                },
            }
        ]
    }
];
