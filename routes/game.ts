﻿/*
 * GET Admin page.
 */
import express = require('express');

export function index(req: express.Request, res: express.Response) {
    res.render('game', { title: 'Game' });
};
