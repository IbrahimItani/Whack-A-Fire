/*
 * GET home page.
 */
import express = require('express');

export function index(req: express.Request, res: express.Response) {
    res.render('index', { title: 'Express' });
};

export function admin(req: express.Request, res: express.Response) {
    res.render('admin', { title: 'Admin UI' });
};

export function game(req: express.Request, res: express.Response) {
    res.render('game', { title: 'Game' });
};

export function videotest(req: express.Request, res: express.Response) {
    res.render('videotest', { title: 'Video Test' });
};

export function testsuite(req: express.Request, res: express.Response) {
    res.render('testsuite', { title: 'Test Suite' });
};