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
                tittle: 'Grade de fotos',
                image: {
                    position: {
                        x: 354,
                        y: 500,
                        width: 2800,
                        height: 2800,
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
                            {x: 0, y: 0, width: 1630, height: 2800},
                            {x: 1730, y: 0, width: 1070, height: 1350},
                            {x: 1730, y: 1450, width: 1070, height: 1350},
                        ],
                    },
                },
            },
            {
                image: {
                    position: {
                        x: 354,
                        y: 500,
                        width: 2800,
                        height: 2800,
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
            }, 
            {
                image: {
                    position: {
                        x: 354,
                        y: 500,
                        width: 2800,
                        height: 2800,
                    },
                    mask: {
                        btn: [
                            // {
                            //     img: false,
                            //     url: 'mask-1.svg',
                            //     clip: {
                            //         url: 'mask-1.svg',
                            //         target: ['1-1', '1-2'],
                            //     }
                            // },
                            {
                                img: false,
                                url: 'mask-2.svg',
                                clip: {
                                    url: 'mask-2.svg',
                                    target: ['1-1', '1-2'],
                                }
                            },
                            {
                                img: false,
                                url: 'mask-3.svg',
                                clip: {
                                    url: 'mask-3.svg',
                                    target: ['1-1', '1-2'],
                                }
                            },
                            {
                                img: false,
                                url: 'mask-4.svg',
                                clip: {
                                    url: 'mask-4.svg',
                                    target: ['1-1', '1-2'],
                                }
                            },
                            {
                                
                                img: false,
                                url: 'mask-5.svg',
                                clip: {
                                    url: 'mask-5.svg',
                                    target: ['1-1', '1-2'],
                                }
                            },
                            {
                                img: false,
                                url: 'mask-6.svg',
                                clip: {
                                    url: 'mask-6.svg',
                                    target: ['1-1', '1-2'],
                                }
                            },
                        ],
                        attrs: {
                            fill: 'transparent'
                        },
                    },
                },
            }, 
        ]
    }
];
