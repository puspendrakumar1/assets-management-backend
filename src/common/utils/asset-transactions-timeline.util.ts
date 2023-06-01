export function generateTimeLineData(data = []) {
  const timeline = [];
  const dataLength = data.length;
  data.forEach((d, index) => {
    timeline.push({
      firstName: d?.user?.firstName || '',
      lastName: d?.user?.lastName || '',
      x: d.allocationStatus,
      y: [
        new Date(d.createdAt).getTime(),
        index + 1 !== dataLength
          ? new Date(data[index + 1].createdAt).getTime()
          : new Date().getTime(),
      ],
      _id: d?.allocationToUserId?._id || '',
    });
  });

  return timeline;
}
