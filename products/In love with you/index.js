var colorMenu = [
    {
        color: '#ff0000',
    },
];

var iniciar = {
    produtos: ['Camiseta'],
    add: {
        Frente: {
            attrs: [
                {x: 124, y: 158, width: 628, height: 154},
            ],
            add: [
                {
                    mask: {
                        url: 'front.svg',
                        attrs: {
                            jsColor: [
                                { attrs: ['fill'], id: 1 },
                            ],
                        }
                    },
                },
            ]
        },
        Costa: {
            attrs: [
                {width: 877, height: 846},
            ],
            add: [
                {
                    rect: {
                        x: 2,
                        y: 2,
                        width: 873,
                        height: 842,
                        jsColor: [
                            { attrs: ['fill'], id: 1 },
                        ],
                    },
                },
                {
                    tittle: 'Foto',
                    group: {width: 877, height: 846},
                    upload: {
                        type: 'svg',
                        attrs: {
                            noEdit: {
                                jsColor: [
                                    { attrs: ['color', 'borderColor'], id: 1 },
                                ],
                            },
                            edit: {
                                borderWidth: 10,
                                extraBorder: 10
                            }
                        },
                        add: [
                            {width: 808, height: 776, x: 28, y: 42}
                        ],
                    },
                    clipFunc: 'mask.svg'
                },
                {
                    clip: 'back.svg'
                },
            ]
        },
    }
};