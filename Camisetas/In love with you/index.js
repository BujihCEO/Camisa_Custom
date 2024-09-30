var colorMenu = [
    {
        color: '#cb6ce6',
    },
];

var iniciar = [
    {
        node: Camiseta.Frente,
        add: [
            {
                image: {
                    position: {
                        x: 0,
                        y: 0,
                        width: 'full',
                        height: 'full',
                    },
                    mask: {
                        url: 'img-1.svg',
                        attrs: {
                            jsColor: [
                                { attrs: ['fill'], id: 1 },
                            ],
                        },
                    },
                },
            }
        ]
    },
    {
        node: Camiseta.Costa,
        add: [
            {
                image: {
                    position: {
                        y: 0,
                        width: 3425,
                        height: 3297,
                    },
                    mask: {
                        url: 'img-2.svg',
                        attrs: {
                            jsColor: [
                                { attrs: ['fill'], id: 1 },
                            ],
                        },
                    },
                }
            },
            {
                tittle: 'Foto no coração',
                image: {
                    position: {
                        y: 0,
                        width: 3425,
                        height: 3297,
                    },
                    upload: { 
                        type: 'svg',
                        attrs: {
                            noEdit: {
                                jsColor: [
                                    { attrs: ['fill'], id: 1 },
                                ],
                            }
                        },
                        add: [
                            {width: 3425, height: 3297},
                        ],
                    },
                    clip: {
                        url: 'mask.svg',
                    },
                },
            },
        ]
    }
];
