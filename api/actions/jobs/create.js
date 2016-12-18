// import load from './load';

export default function create(req) {
  return new Promise((resolve, reject) => {
    // write to database
    setTimeout(() => {
      // const widgets = data;
      const job = req.body;
      if (job.city === 'Bobonong') {
        reject('We do not accept Bobonong jobs xD');
      }
      // if (widget.id) {
      //   widgets[widget.id - 1] = widget;  // id is 1-based. please don't code like this in production! :-)
      //   req.session.widgets = widgets;
      // }
      resolve(job);
    }, 1500); // simulate async db write
  });
}
