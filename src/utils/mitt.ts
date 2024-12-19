import mitt from "mitt";

type Events = {
  showToast: string;
};

const emitter = mitt<Events>();

export default emitter;
