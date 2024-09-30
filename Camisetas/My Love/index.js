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
                image: {
                    position: {
                        x: 0,
                        y: 0, 
                        width: 3508,
                        height: 1325,
                    },
                    mask: {
                        btn: [
                            {
                                url: 'img-1.svg',
                            },
                            {
                                url: 'img-2.svg',
                            },
                            {
                                url: 'img-3.svg',
                            },
                            {
                                url: 'img-4.svg',
                            },
                        ],
                        attrs: {
                            jsColor: [
                                { attrs: ['fill'], id: 1 },
                            ],
                        },
                    },
                },
            },
            {
                tittle: 'Grade de fotos',
                image: {
                    position: {
                        x: 104,
                        y: 1325,
                        width: 3300,
                        height: 2408,
                    },
                    upload: { 
                        type: '',
                        attrs: {
                            noEdit: {
                                jsColor: [
                                    { attrs: ['imgFill'], id: 1 },
                                ],
                            },
                        },
                        add: [
                            {x: 0, y: 0, width: 1650, height: 1204},
                            {x: 1650, y: 0, width: 1650, height: 1204},
                            {x: 0, y: 1204, width: 1650, height: 1204},
                            {x: 1650, y: 1204, width: 1650, height: 1204},
                        ],
                    },
                },
            },
            {
                image: {
                    position: {
                        x: 104,
                        y: 3810,
                        width: 3300,
                        height: 260,
                    },
                    mask: {
                        url: 'img-5.svg',
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
