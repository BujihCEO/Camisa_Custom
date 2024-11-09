var colorMenu = [
    {
        color: '#e65a8f',
    },
    {
        color: '#909ef6',
    },
];

var iniciar = {
    produtos: ['Camiseta', 'BabyLook', 'Cropped', 'Ecobag'],
    add: {
        Frente: {
            attrs: [
                {x: 127, y: 112, width: 622, height: 622},
                {x: 98, y: 54, width: 600, height: 600},
                {x: 118, y: 0, width: 531, height: 531},
                {x: 148, y: 0, width: 884, height: 884},
            ],
            add: [
                {
                    tittle: 'Fundo',
                    mask: {
                        btn: [
                            {
                                url: 'mask-1.svg',
                            },
                            {
                                url: 'mask-2.svg',
                            },
                            {
                                url: 'mask-3.svg',
                            },
                            {
                                url: 'mask-4.svg',
                            },
                        ],
                        attrs: {
                            jsColor: [
                                { attrs: ['fill'], id: 1 },
                            ],
                        }
                    },
                },
                {
                    tittle: 'Foto',
                    upload: {
                        type: 'svg',
                        attrs: {
                            noEdit: {
                                jsColor: [
                                    { attrs: ['color', 'borderColor'], id: 2 },
                                ],
                            },
                            edit: {
                                borderWidth: 20,
                                extraBorder: 20
                            }
                        },
                        add: [
                            {width: 362, height: 622},
                            {x: 384, width: 238, height: 302},
                            {x: 384, y: 320, width: 238, height: 302},
                        ]
                    },
                },
            ]
        },
    }
};
